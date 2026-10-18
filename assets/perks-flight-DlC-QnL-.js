import{W as H,L as X,S as _,P as j,G as q,a as N,D as V,M as B,b as J,T as K}from"./index-DmNCHGZc.js";const Q=`
varying vec2 vUv;
varying float vDissolve;
varying float vReveal;
uniform float dissolveStart;
uniform float dissolveEnd;
uniform float revealStart;
uniform float revealEnd;
uniform float bendFactor;
uniform float bendCenter;
uniform float bendDirection;
void main() {
  vUv = uv;
  vec3 transformed = position;
  float xOffset = abs(uv.x - bendCenter);
  float yOffset = abs(uv.y - bendCenter);
  float maxOffset = max(bendCenter, 1.0 - bendCenter);
  float factor = 1.0 - ((xOffset * xOffset) / (maxOffset * maxOffset)) * ((yOffset * yOffset) / (maxOffset * maxOffset));
  transformed.z -= bendFactor / 1.2 * factor * bendDirection * -1.0;
  vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
  vReveal = clamp((worldPos.z - revealStart) / (revealEnd - revealStart), 0.0, 1.0);
  vDissolve = clamp((worldPos.z - dissolveStart) / (dissolveEnd - dissolveStart), 0.0, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}`,Z=`
uniform sampler2D map;
uniform float pixelSize;
varying vec2 vUv;
varying float vDissolve;
varying float vReveal;
void main() {
  vec2 cellCenter = (floor(vUv / pixelSize) + 0.5) * pixelSize;
  vec4 color = texture2D(map, vUv);
  vec2 diff = abs(vUv - cellCenter);
  float maxDiff = max(diff.x, diff.y);
  float feather = pixelSize * 0.1;
  float threshold = ((pixelSize / 2.0) + feather) * vDissolve;
  float mask = smoothstep(threshold - feather, threshold, maxDiff);
  color.rgb *= mask;
  color.a *= mask * vReveal;
  if (color.a < 0.01) discard;
  gl_FragColor = color;
}`,$=20,A=-42,ee=100,U=4,n={slide:1.5,slideY:.5,turn:.08,turnY:.025,tip:.08,maxTip:Math.PI/6,follow:.08};function oe({canvas:l,shots:y,layouts:z,perGroup:O,alongOf:G}){const h=matchMedia("(prefers-reduced-motion: reduce)").matches,C=matchMedia("(hover: hover) and (pointer: fine)").matches,f=new H({canvas:l,antialias:!1,alpha:!0});f.setClearColor(0,0),f.setPixelRatio(Math.min(devicePixelRatio,1.5)),f.outputColorSpace=X;const R=new _,t=new j(35,1,.1,500),D=C?$:28;t.position.set(0,0,D);const m={factor:{value:0},direction:{value:1}},c=[],I=y.map(({width:o,height:e},i)=>{const a=Math.floor(i/O);c[a]||(c[a]=new q,R.add(c[a]));const[g,v,W]=z[a%z.length][i%O],T=o/e,k=new N({vertexShader:Q,fragmentShader:Z,transparent:!0,side:V,uniforms:{map:{value:null},dissolveStart:{value:8},dissolveEnd:{value:19},revealStart:{value:-40},revealEnd:{value:0},pixelSize:{value:.01},bendFactor:m.factor,bendCenter:{value:.5},bendDirection:m.direction}}),x=new B(new J(U*Math.max(1,T),U/Math.min(1,T),32,32),k);return x.position.set(g,v,W),x.visible=!1,c[a].add(x),x});let E=!1;const L=()=>{if(E)return;E=!0;const o=new K;I.forEach((e,i)=>{o.load(y[i].url,a=>{a.anisotropy=4,e.material.uniforms.map.value=a,e.visible=!0})})},P=()=>{const o=l.clientWidth,e=l.clientHeight;f.setSize(o,e,!1),t.aspect=o/e,t.updateProjectionMatrix()};new ResizeObserver(P).observe(l),P();const s={x:0,y:0};let b=0,Y=0;C&&!h&&window.addEventListener("mousemove",o=>{const e=o.clientX/innerWidth*2-1;s.x=e,s.y=-(o.clientY/innerHeight*2-1),b+=(e-Y)*n.tip,Y=e});let r=scrollY,S=scrollY,d=0,M=1,w=!1,u=0,p=0;const F=o=>{if(u=0,!w)return;const e=p?Math.min((o-p)/(1e3/60),6):1;if(p=o,r+=(scrollY-r)*(h?1:1-.9**e),Math.abs(scrollY-r)<.5&&(r=scrollY),c.forEach((a,g)=>{const v=G(g,r);a.visible=v>-.02&&v<1.02,a.position.z=A+(ee-A)*v}),!h){const a=r-S;a&&(M+=((a>0?1:-1)-M)*.2),d=Math.max(d*.99**e,Math.min(Math.abs(a)*.05,2)),d<.01&&(d=0),m.factor.value=d,m.direction.value=M}S=r;const i=1-(1-n.follow)**e;t.position.x+=(-s.x*n.slide-t.position.x)*i,t.position.y+=(-s.y*n.slideY-t.position.y)*i,t.position.z+=(D-t.position.z)*(1-.95**e),t.rotation.x+=(s.y*n.turnY-t.rotation.x)*i,t.rotation.y+=(-s.x*n.turn-t.rotation.y)*i,t.rotation.z=Math.max(-n.maxTip,Math.min(n.maxTip,t.rotation.z+b*i)),t.rotation.z*=.96**e,b*=.85**e,f.render(R,t),u=requestAnimationFrame(F)};new IntersectionObserver(([o])=>{o.isIntersecting&&L(),w=o.intersectionRatio>0&&o.isIntersecting,w&&!u&&(p=0,r=S=scrollY,u=requestAnimationFrame(F))},{rootMargin:"100% 0px"}).observe(l)}export{oe as initPerksFlight};
