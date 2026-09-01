export interface Oklch { l: number; c: number; h: number; }
export interface Rgb { r: number; g: number; b: number; }

export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const hr = h * Math.PI / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  const l_ = l + 0.3963377774*a + 0.2158037573*b;
  const m_ = l - 0.1055613458*a - 0.0638541728*b;
  const s_ = l - 0.0894841775*a - 1.291485548*b;
  const l3=l_**3, m3=m_**3, s3=s_**3;
  return {
    r: encode(4.0767416621*l3 - 3.3077115913*m3 + 0.2309699292*s3),
    g: encode(-1.2684380046*l3 + 2.6097574011*m3 - 0.3413193965*s3),
    b: encode(-0.0041960863*l3 - 0.7034186147*m3 + 1.707614701*s3)
  };
}
function encode(v:number):number {
  const x=Math.max(0,Math.min(1,v));
  return x <= 0.0031308 ? 12.92*x : 1.055*Math.pow(x,1/2.4)-0.055;
}
export function rgbToHex(rgb:Rgb):string {
  const c=(v:number)=>Math.round(v*255).toString(16).padStart(2,"0");
  return `#${c(rgb.r)}${c(rgb.g)}${c(rgb.b)}`;
}
export function hexToRgb(hex:string):Rgb {
  const v=hex.replace("#","");
  return {r:parseInt(v.slice(0,2),16)/255,g:parseInt(v.slice(2,4),16)/255,b:parseInt(v.slice(4,6),16)/255};
}
export function relativeLuminance(rgb:Rgb):number {
  const lin=(v:number)=>{const x=Math.max(0,Math.min(1,v));return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);};
  return 0.2126*lin(rgb.r)+0.7152*lin(rgb.g)+0.0722*lin(rgb.b);
}
export function foregroundFor(rgb:Rgb):"#000000"|"#ffffff" {
  return relativeLuminance(rgb)>0.42 ? "#000000" : "#ffffff";
}