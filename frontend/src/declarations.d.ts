declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'jwt-decode' {
  export function jwtDecode<T>(token: string): T;
} 