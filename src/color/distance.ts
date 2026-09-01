import { Oklch } from "./oklch";
export function perceptualDistance(a:Oklch,b:Oklch):number {
  const dh=Math.min(Math.abs(a.h-b.h),360-Math.abs(a.h-b.h));
  return Math.sqrt((Math.abs(a.l-b.l)*100)**2+(Math.abs(a.c-b.c)*100)**2+((dh/180)*50)**2);
}