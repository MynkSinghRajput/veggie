const paths = {
  search: <><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
  cart: <><path d="M4 5h2l1.2 9h9.9l2-7H7"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></>,
  user: <><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c.8-3.1 3.1-4.7 6.5-4.7s5.7 1.6 6.5 4.7"/></>,
  arrowRight: <><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
  arrowLeft: <><path d="M19 12H6"/><path d="m11 6-6 6 6 6"/></>,
  chevronDown: <path d="m7 10 5 5 5-5"/>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  minus: <path d="M5 12h14"/>,
  trash: <><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="m7 7 .8 13h8.4L17 7"/><path d="M10 11v5M14 11v5"/></>,
  close: <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
  eye: <><path d="M2.5 12s3.2-5.2 9.5-5.2 9.5 5.2 9.5 5.2-3.2 5.2-9.5 5.2S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.2"/></>,
  eyeOff: <><path d="m3 3 18 18"/><path d="M10.5 6.9A10.8 10.8 0 0 1 12 6.8c6.3 0 9.5 5.2 9.5 5.2a18.2 18.2 0 0 1-3 3.5"/><path d="M6.1 9.1C3.9 10.6 2.5 12 2.5 12S5.7 17.2 12 17.2c1.1 0 2.1-.2 3-.5"/><path d="M9.9 9.9A2.9 2.9 0 0 0 15 12c0 .4-.1.8-.2 1.1"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  package: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/></>,
  leaf: <><path d="M20 4c-8.5.2-13.6 4-13.6 9.2 0 4 3.2 6.6 7.1 6.6 4.9 0 6.4-4 6.5-15.8Z"/><path d="M4 20c1.5-5.2 4.6-8.7 10.2-11.2"/></>,
  shield: <><path d="m12 3 7 3v5.5c0 4.8-2.8 8.1-7 9.5-4.2-1.4-7-4.7-7-9.5V6l7-3Z"/><path d="m8.8 12.4 2.1 2.1 4.3-4.5"/></>,
  star: <path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.1L12 17.2 6.4 20.2l1.1-6.1L3 9.7l6.2-.9L12 3Z"/>,
  mapPin: <><path d="M12 21s6-5.5 6-11A6 6 0 1 0 6 10c0 5.5 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></>,
  lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  check: <path d="m5 12 4.1 4.1L19 6.3"/>,
  spark: <><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4L12 3Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/></>,
  refresh: <><path d="M4 12a8 8 0 0 1 13.7-5.7L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-13.7 5.7L4 16"/><path d="M4 20v-4h4"/></>,
};

export default function Icon({ name, size = 20, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.spark}
    </svg>
  );
}
