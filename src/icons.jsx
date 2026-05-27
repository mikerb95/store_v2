// Lucide icons — read from the loaded global and build small React wrappers.
// Each wrapper returns an inline SVG with the proper stroke.
const L = (window.lucide && window.lucide.icons) || {};

function makeIcon(name) {
  return function Icon({ size = 18, strokeWidth = 1.5, className = "", ...rest }) {
    const data = L[name];
    if (!data) return null;
    // lucide icon data is [tag, attrs, children?] per node
    const renderNode = (node, key) => {
      const [tag, attrs, children] = node;
      const props = { key, ...attrs };
      const kids = Array.isArray(children) ? children.map(renderNode) : null;
      return React.createElement(tag, props, kids);
    };
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
        {...rest}
      >
        {Array.isArray(data) ? data.map(renderNode) : null}
      </svg>
    );
  };
}

const Icons = {
  Search: makeIcon("Search"),
  ShoppingBag: makeIcon("ShoppingBag"),
  User: makeIcon("User"),
  X: makeIcon("X"),
  Menu: makeIcon("Menu"),
  ArrowRight: makeIcon("ArrowRight"),
  ArrowLeft: makeIcon("ArrowLeft"),
  ArrowUpRight: makeIcon("ArrowUpRight"),
  ChevronDown: makeIcon("ChevronDown"),
  ChevronRight: makeIcon("ChevronRight"),
  ChevronLeft: makeIcon("ChevronLeft"),
  Plus: makeIcon("Plus"),
  Minus: makeIcon("Minus"),
  Heart: makeIcon("Heart"),
  Eye: makeIcon("Eye"),
  Edit: makeIcon("Pencil"),
  Trash: makeIcon("Trash2"),
  Filter: makeIcon("SlidersHorizontal"),
  Grid: makeIcon("LayoutGrid"),
  List: makeIcon("LayoutList"),
  Check: makeIcon("Check"),
  Settings: makeIcon("Settings"),
  Package: makeIcon("Package"),
  Users: makeIcon("Users"),
  Truck: makeIcon("Truck"),
  CreditCard: makeIcon("CreditCard"),
  FileText: makeIcon("FileText"),
  Image: makeIcon("Image"),
  Mail: makeIcon("Mail"),
  Lock: makeIcon("Lock"),
  Globe: makeIcon("Globe"),
  Home: makeIcon("Home"),
  Bell: makeIcon("Bell"),
  TrendingUp: makeIcon("TrendingUp"),
  TrendingDown: makeIcon("TrendingDown"),
  Activity: makeIcon("Activity"),
  Layers: makeIcon("Layers"),
  LogOut: makeIcon("LogOut"),
  Star: makeIcon("Star"),
  Calendar: makeIcon("Calendar"),
  MapPin: makeIcon("MapPin"),
  Phone: makeIcon("Phone"),
  Download: makeIcon("Download"),
  Upload: makeIcon("Upload"),
  Save: makeIcon("Save"),
  Eye2: makeIcon("Eye"),
  AlertTriangle: makeIcon("TriangleAlert"),
  Building: makeIcon("Building2"),
  Tag: makeIcon("Tag"),
  Ruler: makeIcon("Ruler"),
  Compass: makeIcon("Compass"),
  ArrowUp: makeIcon("ArrowUp"),
  ArrowDown: makeIcon("ArrowDown"),
  MoreHorizontal: makeIcon("MoreHorizontal"),
  ExternalLink: makeIcon("ExternalLink"),
  Receipt: makeIcon("Receipt"),
  Sparkles: makeIcon("Sparkles"),
  ShieldCheck: makeIcon("ShieldCheck"),
  Database: makeIcon("Database"),
  Newspaper: makeIcon("Newspaper"),
  Scissors: makeIcon("Scissors"),
};

window.Icons = Icons;
