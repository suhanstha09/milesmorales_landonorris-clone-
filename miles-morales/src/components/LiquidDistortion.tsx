"use client";

import { useRef, useEffect } from "react";

// ─── Vertex Shader (shared) ──────────────────────────────────────────────────
const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// ─── Fluid Displacement Field Update ─────────────────────────────────────────
// Maintains a displacement vector field; mouse movement injects velocity,
// diffusion spreads it, decay lets it settle — creating the liquid feel.
const FLUID_FRAG = `
precision highp float;
uniform sampler2D u_prev;
uniform vec2 u_mouse;
uniform vec2 u_mouseDelta;
uniform float u_active;
uniform vec2 u_texel;
uniform float u_radius;
varying vec2 v_uv;

void main() {
  // Decode displacement from [0,1] → [-1,1]
  vec2 c = (texture2D(u_prev, v_uv).rg - 0.5) * 2.0;
  vec2 l = (texture2D(u_prev, v_uv - vec2(u_texel.x, 0.0)).rg - 0.5) * 2.0;
  vec2 r = (texture2D(u_prev, v_uv + vec2(u_texel.x, 0.0)).rg - 0.5) * 2.0;
  vec2 t = (texture2D(u_prev, v_uv + vec2(0.0, u_texel.y)).rg - 0.5) * 2.0;
  vec2 b = (texture2D(u_prev, v_uv - vec2(0.0, u_texel.y)).rg - 0.5) * 2.0;

  // Diffuse — liquid spread (higher = more gooey)
  c = mix(c, (l + r + t + b) * 0.25, 0.35);

  // Mouse influence — inject velocity at cursor
  float dist = distance(v_uv, u_mouse);
  float infl = smoothstep(u_radius, 0.0, dist) * u_active;
  c += u_mouseDelta * infl * 40.0;

  // Decay — slower for more persistent warping
  c *= 0.982;

  // Clamp to avoid runaway values
  c = clamp(c, -1.0, 1.0);

  // Encode back to [0,1]
  gl_FragColor = vec4(c * 0.5 + 0.5, 0.0, 1.0);
}`;

// ─── Render: Image + Displacement ────────────────────────────────────────────
const RENDER_FRAG = `
precision highp float;
uniform sampler2D u_image;
uniform sampler2D u_disp;
uniform float u_strength;
uniform vec2 u_coverScale;
uniform vec2 u_coverOffset;
varying vec2 v_uv;

void main() {
  vec2 d = (texture2D(u_disp, v_uv).rg - 0.5) * 2.0;

  // Displace UVs — negative to push content in mouse-move direction
  vec2 uv = v_uv - d * u_strength;

  // Cover-fit transform (like CSS object-fit: cover)
  uv = uv * u_coverScale + u_coverOffset;
  uv = clamp(uv, 0.0, 1.0);

  gl_FragColor = texture2D(u_image, uv);
}`;

// ─── WebGL Helpers ───────────────────────────────────────────────────────────
function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function linkProgram(
  gl: WebGLRenderingContext,
  vert: string,
  frag: string
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vert);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

interface FBO {
  fb: WebGLFramebuffer;
  tex: WebGLTexture;
}

function createFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number
): FBO | null {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // Init to 128,128 = zero displacement
  const data = new Uint8Array(w * h * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 128;
    data[i + 1] = 128;
    data[i + 2] = 0;
    data[i + 3] = 255;
  }
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fb = gl.createFramebuffer();
  if (!fb) return null;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fb, tex };
}

// ─── Component ───────────────────────────────────────────────────────────────
interface LiquidDistortionProps {
  /** Image source path */
  src: string;
  /** Accessible alt text */
  alt?: string;
  /** Additional CSS classes */
  className?: string;
  /** Displacement strength 0-1. Default 0.18 */
  strength?: number;
  /** Mouse influence radius 0-1. Default 0.25 */
  radius?: number;
}

export default function LiquidDistortion({
  src,
  alt = "",
  className = "",
  strength = 0.18,
  radius = 0.25,
}: LiquidDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, px: 0.5, py: 0.5, active: 0, hasMoved: false });
  const imgSizeRef = useRef({ w: 1, h: 1 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return;

    // ── Compile programs ──────────────────────────────────────────────────
    const fluidProg = linkProgram(gl, VERT, FLUID_FRAG);
    const renderProg = linkProgram(gl, VERT, RENDER_FRAG);
    if (!fluidProg || !renderProg) return;

    // ── Fullscreen quad ───────────────────────────────────────────────────
    const quadBuf = gl.createBuffer();
    if (!quadBuf) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    // ── Simulation FBOs (ping-pong, 256×256) ──────────────────────────────
    const SIM = 256;
    const fbo0 = createFBO(gl, SIM, SIM);
    const fbo1 = createFBO(gl, SIM, SIM);
    if (!fbo0 || !fbo1) return;
    const fbos = [fbo0, fbo1];

    // ── Load image texture ────────────────────────────────────────────────
    const imgTex = gl.createTexture();
    if (!imgTex) return;
    let imgLoaded = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgSizeRef.current = { w: img.naturalWidth, h: img.naturalHeight };
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.bindTexture(gl.TEXTURE_2D, imgTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      imgLoaded = true;
    };
    img.src = src;

    // ── Draw helper ───────────────────────────────────────────────────────
    const drawQuad = (prog: WebGLProgram) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      const loc = gl.getAttribLocation(prog, "a_position");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // ── Render loop ───────────────────────────────────────────────────────
    let curFBO = 0;
    let alive = true;

    const render = () => {
      if (!alive) return;
      if (!imgLoaded) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      // Resize canvas to match CSS size
      const dpr = Math.min(window.devicePixelRatio, 2);
      const dw = canvas.clientWidth;
      const dh = canvas.clientHeight;
      if (canvas.width !== dw * dpr || canvas.height !== dh * dpr) {
        canvas.width = dw * dpr;
        canvas.height = dh * dpr;
      }

      const m = mouseRef.current;

      // Compute delta only when mouse has moved
      const dx = m.hasMoved ? (m.x - m.px) : 0;
      const dy = m.hasMoved ? (m.y - m.py) : 0;

      // ── Pass 1: Update fluid displacement field ─────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbos[1 - curFBO].fb);
      gl.viewport(0, 0, SIM, SIM);
      gl.useProgram(fluidProg);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fbos[curFBO].tex);
      gl.uniform1i(gl.getUniformLocation(fluidProg, "u_prev"), 0);
      gl.uniform2f(gl.getUniformLocation(fluidProg, "u_mouse"), m.x, 1.0 - m.y);
      gl.uniform2f(
        gl.getUniformLocation(fluidProg, "u_mouseDelta"),
        dx,
        -dy
      );
      gl.uniform1f(gl.getUniformLocation(fluidProg, "u_active"), m.active);
      gl.uniform2f(gl.getUniformLocation(fluidProg, "u_texel"), 1 / SIM, 1 / SIM);
      gl.uniform1f(gl.getUniformLocation(fluidProg, "u_radius"), radius);

      drawQuad(fluidProg);

      curFBO = 1 - curFBO;
      m.hasMoved = false;

      // ── Pass 2: Render image with displacement ──────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(renderProg);

      // Image texture → unit 0
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imgTex);
      gl.uniform1i(gl.getUniformLocation(renderProg, "u_image"), 0);

      // Displacement texture → unit 1
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, fbos[curFBO].tex);
      gl.uniform1i(gl.getUniformLocation(renderProg, "u_disp"), 1);

      gl.uniform1f(gl.getUniformLocation(renderProg, "u_strength"), strength);

      // Cover-fit UV transform (mimics CSS object-fit: cover)
      const imgAspect = imgSizeRef.current.w / imgSizeRef.current.h;
      const canvasAspect = dw / dh;
      let sx = 1,
        sy = 1,
        ox = 0,
        oy = 0;
      if (canvasAspect > imgAspect) {
        sy = imgAspect / canvasAspect;
        oy = (1 - sy) * 0.5;
      } else {
        sx = canvasAspect / imgAspect;
        ox = (1 - sx) * 0.5;
      }
      gl.uniform2f(gl.getUniformLocation(renderProg, "u_coverScale"), sx, sy);
      gl.uniform2f(gl.getUniformLocation(renderProg, "u_coverOffset"), ox, oy);

      drawQuad(renderProg);

      rafRef.current = requestAnimationFrame(render);
    };

    // ── Native mouse/touch listeners (more reliable than React events) ──
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;

      // Check if inside the canvas bounds
      if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
        const m = mouseRef.current;
        m.px = m.x;
        m.py = m.y;
        m.x = nx;
        m.y = ny;
        m.active = 1;
        m.hasMoved = true;
      } else {
        mouseRef.current.active = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!e.touches[0] || rect.width === 0) return;
      const m = mouseRef.current;
      m.px = m.x;
      m.py = m.y;
      m.x = (e.touches[0].clientX - rect.left) / rect.width;
      m.y = (e.touches[0].clientY - rect.top) / rect.height;
      m.active = 1;
      m.hasMoved = true;
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchstart", () => { mouseRef.current.active = 1; }, { passive: true });
    canvas.addEventListener("touchend", () => { mouseRef.current.active = 0; });

    rafRef.current = requestAnimationFrame(render);

    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, [src, strength, radius]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label={alt}
      role="img"
      style={{ display: "block", touchAction: "none", width: "100%", height: "100%" }}
    />
  );
}
