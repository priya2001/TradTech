// Battery icon
export const Battery = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-inherit ${props.className ?? ""}`}
    {...props}
  >
    <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
    <line x1="22" x2="22" y1="11" y2="13" />
    <line x1="6" x2="6" y1="11" y2="13" />
    <line x1="10" x2="10" y1="11" y2="13" />
    <line x1="14" x2="14" y1="11" y2="13" />
  </svg>
);

// Lightbulb icon
export const Lightbulb = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-inherit ${props.className ?? ""}`}
    {...props}
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2v4" />
    <path d="M12 14v4" />
    <path d="M8 8h.01" />
    <path d="M16 8h.01" />
    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
  </svg>
);

// Fan icon
export const Fan = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-inherit ${props.className ?? ""}`}
    {...props}
  >
    <path d="M12 2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-2z" />
    <path d="M12 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2z" />
    <path d="M22 12a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2z" />
    <path d="M2 12a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2z" />
    <path d="M19.071 4.929a1 1 0 0 0-1.414 0l-2.829 2.828a1 1 0 0 0 0 1.415l1.414 1.414a1 1 0 0 0 1.414 0l2.829-2.828a1 1 0 0 0 0-1.415l-1.414-1.414z" />
    <path d="M4.929 19.071a1 1 0 0 1-1.414 0l-1.414-1.414a1 1 0 0 1 0-1.415l2.828-2.828a1 1 0 0 1 1.415 0l1.414 1.414a1 1 0 0 1 0 1.414l-2.829 2.829z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Payment machine icon
export const PaymentMachine = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-inherit ${props.className ?? ""}`}
    {...props}
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="7" y1="15" x2="7" y2="15" />
    <line x1="11" y1="15" x2="11" y2="15" />
    <line x1="15" y1="15" x2="15" y2="15" />
  </svg>
);

// Sugarcane icon
export const Sugarcane = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-inherit ${props.className ?? ""}`}
    {...props}
  >
    <path d="M4 14c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" />
    <path d="M10 4V2" />
    <path d="M10 8V6" />
    <path d="M14 6c0-1.857 0-3 2-3s2 1.143 2 3c0 3-4 3-4 6" />
  </svg>
);

// Glass icon
export const Glass = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-inherit ${props.className ?? ""}`}
    {...props}
  >
    <path d="M8 21h8" />
    <path d="M12 15v6" />
    <path d="M18 11l.707-.707A1 1 0 0 0 19 9.586V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3.586a1 1 0 0 0 .293.707L6 11a5 5 0 0 0 12 0z" />
  </svg>
);

// Solar Panel icon
export const SolarPanel = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-inherit ${props.className ?? ""}`}
    {...props}
  >
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <line x1="3" y1="8" x2="21" y2="8" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="9" y1="4" x2="9" y2="16" />
    <line x1="15" y1="4" x2="15" y2="16" />
    <path d="M12 16v4" />
    <path d="M8 20h8" />
  </svg>
);

// Shop icon
export const Shop = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-inherit ${props.className ?? ""}`}
    {...props}
  >
    <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
    <path d="M3 9v0a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v0" />
    <line x1="8" y1="4" x2="8" y2="5" />
    <line x1="16" y1="4" x2="16" y2="5" />
    <path d="M21 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
  </svg>
);
