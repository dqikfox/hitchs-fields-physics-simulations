import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as __exportAll } from "./ssr.mjs";
import { a as Play, c as Eye, i as RotateCcw, l as EyeOff, o as Pause, r as Trash2, s as FlipHorizontal, t as Zap, u as Anchor } from "../_libs/lucide-react.mjs";
import { r as signOut, t as authClient } from "./client-BoQscsbY.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CWhjF1MY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LabErrorBoundary = class extends import_react.Component {
	state = { error: null };
	static getDerivedStateFromError(error) {
		return { error };
	}
	render() {
		if (this.state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 z-20 grid place-items-center px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md rounded-xl border border-line bg-surface p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] tracking-[0.24em] text-muted uppercase",
						children: "Solver trip"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-lg font-medium",
						children: "The bench went unstable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: this.state.error.message || "A physics or graphics fault stopped the lab."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-5 h-10 w-full rounded-md bg-fg text-sm text-bg",
						onClick: () => {
							this.setState({ error: null });
							this.props.onReset();
						},
						children: "Reset the bench"
					})
				]
			})
		});
		return this.props.children;
	}
};
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-fg",
			ghost: "bg-transparent text-fg hover:bg-surface-2 border border-transparent hover:border-line",
			outline: "border border-line bg-surface text-fg hover:border-accent hover:bg-surface-2",
			north: "bg-north text-fg hover:brightness-110",
			south: "bg-south text-fg hover:brightness-110"
		},
		size: {
			default: "h-10 px-3",
			sm: "h-8 px-2.5 text-xs",
			icon: "size-10",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "outline",
		size: "default"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	type,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-6 w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-3.5 rounded-full border border-line bg-fg shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/40" })]
	});
}
/**
* Published room-temperature material data used by the solver.
* Br midpoints from manufacturer grade tables (K&J / IEC / MMPA):
*   N52  1.44–1.52 T · N42  1.29–1.35 T · Ferrite C8  0.39 T
*   Alnico 5  1.25 T · SmCo 26  1.05 T
* Conductivities: CRC / IACS. Mercury χ from CRC Handbook.
*/
var CATALOG = {
	"n52-bar": {
		id: "n52-bar",
		label: "N52 bar",
		short: "N52",
		kind: "magnet",
		shape: "box",
		size: [
			.02,
			.02,
			.05
		],
		density: 7500,
		Br: 1.48,
		momentAxis: "z",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1.05,
		conductivity: 67e4,
		chi: 0,
		color: "#6d727a",
		notes: "NdFeB N52, Br 1.48 T, (BH)max ≈ 52 MGOe. Strongest common sintered grade.",
		source: "MMPA / manufacturer grade tables, Br 1.44–1.52 T"
	},
	"n52-disc": {
		id: "n52-disc",
		label: "N52 disc",
		short: "Disc",
		kind: "magnet",
		shape: "cylinder",
		size: [
			.025,
			.008,
			.025
		],
		density: 7500,
		Br: 1.48,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1.05,
		conductivity: 67e4,
		chi: 0,
		color: "#6d727a",
		notes: "Axially magnetized NdFeB disc. Surface field typically 0.3–0.5 T.",
		source: "NdFeB N52 remnant induction 1.48 T"
	},
	"n42-cube": {
		id: "n42-cube",
		label: "N42 cube",
		short: "N42",
		kind: "magnet",
		shape: "box",
		size: [
			.02,
			.02,
			.02
		],
		density: 7500,
		Br: 1.32,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1.05,
		conductivity: 67e4,
		chi: 0,
		color: "#7a7f86",
		notes: "NdFeB N42, Br 1.32 T. Higher coercivity than N52, slightly weaker.",
		source: "N42 Br 1.29–1.35 T"
	},
	"ferrite-block": {
		id: "ferrite-block",
		label: "Ferrite C8",
		short: "C8",
		kind: "magnet",
		shape: "box",
		size: [
			.04,
			.012,
			.025
		],
		density: 4900,
		Br: .39,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1.1,
		conductivity: 1e-4,
		chi: 0,
		color: "#2c2a28",
		notes: "Ceramic C8 / Y30. Cheap, brittle, electrically insulating.",
		source: "Ceramic 8 Br ≈ 0.39 T, BHmax ≈ 3.5 MGOe"
	},
	"ferrite-horseshoe": {
		id: "ferrite-horseshoe",
		label: "Horseshoe",
		short: "U",
		kind: "magnet",
		shape: "horseshoe",
		size: [
			.05,
			.03,
			.018
		],
		density: 4900,
		Br: .39,
		momentAxis: "z",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1.1,
		conductivity: 1e-4,
		chi: 0,
		color: "#c45c5c",
		notes: "U-magnet. Poles sit at the open tips; field concentrates in the gap.",
		source: "Ferrite C8 poles, Gilbert two-charge model"
	},
	"alnico-rod": {
		id: "alnico-rod",
		label: "Alnico 5 rod",
		short: "AlNiCo",
		kind: "magnet",
		shape: "cylinder",
		size: [
			.012,
			.06,
			.012
		],
		density: 7300,
		Br: 1.25,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1.5,
		conductivity: 2e6,
		chi: 0,
		color: "#8a7a5a",
		notes: "Alnico 5. High Br, very low coercivity (Hc ≈ 51 kA/m) — easy to reverse.",
		source: "Alnico 5 Br 1.25 T, Hc 640 Oe"
	},
	"smco-cube": {
		id: "smco-cube",
		label: "SmCo 26",
		short: "SmCo",
		kind: "magnet",
		shape: "box",
		size: [
			.018,
			.018,
			.018
		],
		density: 8400,
		Br: 1.05,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1.05,
		conductivity: 11e5,
		chi: 0,
		color: "#5d6560",
		notes: "Sm2Co17 grade 26. Stable to ~300 °C. Dense rare-earth magnet.",
		source: "SmCo 26 Br 1.05 T, BHmax 26 MGOe, ρ 8.4 g/cm³"
	},
	electromagnet: {
		id: "electromagnet",
		label: "Electromagnet",
		short: "EM",
		kind: "electromagnet",
		shape: "coil",
		size: [
			.036,
			.055,
			.036
		],
		density: 7200,
		Br: 0,
		momentAxis: "y",
		voltage: 12,
		resistance: 4,
		turns: 400,
		coreMuR: 80,
		conductivity: 596e5,
		chi: 200,
		color: "#b87333",
		notes: "400-turn Cu coil, 4 Ω, iron core μr ≈ 80. I = V/R. m = N I A μr.",
		source: "Finite solenoid + core, Ampere moment NIA"
	},
	"copper-plate": {
		id: "copper-plate",
		label: "Copper plate",
		short: "Cu",
		kind: "conductor",
		shape: "box",
		size: [
			.12,
			.004,
			.08
		],
		density: 8960,
		Br: 0,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1,
		conductivity: 596e5,
		chi: -96e-7,
		color: "#b87333",
		notes: "OFHC copper. σ = 5.96×10⁷ S/m. Eddy brake / Lenz plate.",
		source: "IACS copper conductivity 5.96e7 S/m"
	},
	"copper-tube": {
		id: "copper-tube",
		label: "Copper tube",
		short: "Tube",
		kind: "tube",
		shape: "tube",
		size: [
			.032,
			.18,
			.032
		],
		density: 8960,
		Br: 0,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1,
		conductivity: 596e5,
		chi: -96e-7,
		color: "#b87333",
		notes: "Thick-wall Cu tube. Classic magnet-drop Lenz demo.",
		source: "Lenz’s law eddy damping in a conducting pipe"
	},
	"aluminum-disc": {
		id: "aluminum-disc",
		label: "Aluminum disc",
		short: "Al",
		kind: "conductor",
		shape: "cylinder",
		size: [
			.07,
			.005,
			.07
		],
		density: 2700,
		Br: 0,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1,
		conductivity: 377e5,
		chi: 22e-6,
		color: "#b0b4ba",
		notes: "1100-O aluminum. Lighter eddy brake than copper.",
		source: "Al conductivity 3.77e7 S/m"
	},
	"iron-block": {
		id: "iron-block",
		label: "Iron block",
		short: "Fe",
		kind: "ferromagnetic",
		shape: "box",
		size: [
			.025,
			.02,
			.025
		],
		density: 7874,
		Br: 0,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 200,
		conductivity: 1e7,
		chi: 199,
		color: "#4a4d52",
		notes: "Soft iron, μr ≈ 200, saturates near 1.6 T. Attracted into ∇B.",
		source: "Mild steel μr 100–400, Ms ≈ 1.6 T"
	},
	"steel-ball": {
		id: "steel-ball",
		label: "Steel ball",
		short: "Ball",
		kind: "ferromagnetic",
		shape: "sphere",
		size: [
			.018,
			.018,
			.018
		],
		density: 7800,
		Br: 0,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 150,
		conductivity: 6e6,
		chi: 149,
		color: "#5a5e64",
		notes: "Bearing steel. Induced dipole follows the local field.",
		source: "Soft ferromagnetic sphere, χ ≈ μr − 1"
	},
	"mercury-drop": {
		id: "mercury-drop",
		label: "Mercury drop",
		short: "Hg",
		kind: "mercury",
		shape: "sphere",
		size: [
			.016,
			.016,
			.016
		],
		density: 13534,
		Br: 0,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1,
		conductivity: 104e4,
		chi: -29e-6,
		color: "#c5c8cc",
		notes: "Liquid Hg at 20 °C. ρ 13.534 g/cm³ — NdFeB floats on it. Diamagnetic.",
		source: "CRC: σ 1.04e6 S/m, χ −2.9e-5, ρ 13534 kg/m³"
	},
	"mercury-pool": {
		id: "mercury-pool",
		label: "Mercury pool",
		short: "Pool",
		kind: "pool",
		shape: "pool",
		size: [
			.16,
			.028,
			.16
		],
		density: 13534,
		Br: 0,
		momentAxis: "y",
		voltage: 0,
		resistance: 1,
		turns: 0,
		coreMuR: 1,
		conductivity: 104e4,
		chi: -29e-6,
		color: "#c5c8cc",
		notes: "Open Hg bath. Buoyancy + eddy damping. Magnets float (ρ 7.5 < 13.5).",
		source: "Archimedes + Faraday induction in liquid metal"
	}
};
var SPAWN_ORDER = [
	"n52-bar",
	"n52-disc",
	"n42-cube",
	"ferrite-block",
	"ferrite-horseshoe",
	"alnico-rod",
	"smco-cube",
	"electromagnet",
	"copper-plate",
	"copper-tube",
	"aluminum-disc",
	"iron-block",
	"steel-ball",
	"mercury-drop",
	"mercury-pool"
];
var seq = 1;
function createBody(catalogId, position, extras = {}) {
	const item = CATALOG[catalogId];
	const volume = volumeOf(item.shape, item.size);
	const mass = Math.max(.004, item.density * volume);
	const anchored = extras.anchored ?? (item.kind === "electromagnet" || item.kind === "tube" || item.kind === "pool");
	return {
		id: extras.id ?? `${catalogId}-${seq++}`,
		kind: item.kind,
		catalogId,
		label: extras.label ?? item.label,
		position,
		rotation: extras.rotation ?? [
			0,
			0,
			0
		],
		size: extras.size ?? item.size,
		shape: item.shape,
		mass: extras.mass ?? mass,
		density: item.density,
		Br: extras.Br ?? item.Br,
		polarity: extras.polarity ?? 1,
		momentAxis: extras.momentAxis ?? item.momentAxis,
		voltage: extras.voltage ?? item.voltage,
		resistance: item.resistance,
		turns: item.turns,
		coreMuR: item.coreMuR,
		powered: extras.powered ?? item.kind === "electromagnet",
		conductivity: item.conductivity,
		chi: item.chi,
		anchored,
		color: item.color
	};
}
function volumeOf(shape, size) {
	const [sx, sy, sz] = size;
	switch (shape) {
		case "sphere": return 4 / 3 * Math.PI * Math.pow(sx / 2, 3);
		case "cylinder":
		case "coil": return Math.PI * Math.pow(sx / 2, 2) * sy;
		case "tube": return Math.PI * (Math.pow(sx / 2, 2) - Math.pow(sx / 2 - .004, 2)) * sy;
		case "pool": return Math.PI * Math.pow(sx / 2, 2) * sy;
		case "horseshoe": return sx * sy * sz * .55;
		default: return sx * sy * sz;
	}
}
function characteristicSize(size) {
	return Math.max(size[0], size[1], size[2]);
}
/** μ₀ = 4π×10⁻⁷ T·m/A */
var MU0 = 125663706212e-17;
var MU0_4PI = 1e-7;
var R_MIN = .014;
var F_POLE_CAP = 12;
var F_BODY_CAP = 16;
var TAU_CAP = .4;
var EDDY_GEO = .18;
var FERRO_SAT = 1.6;
function vset(x = 0, y = 0, z = 0) {
	return {
		x,
		y,
		z
	};
}
function vsub(a, b, o) {
	o.x = a.x - b.x;
	o.y = a.y - b.y;
	o.z = a.z - b.z;
	return o;
}
function vscale(a, s, o) {
	o.x = a.x * s;
	o.y = a.y * s;
	o.z = a.z * s;
	return o;
}
function vdot(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}
function vlen(a) {
	return Math.hypot(a.x, a.y, a.z);
}
function vcopy(a, o) {
	o.x = a.x;
	o.y = a.y;
	o.z = a.z;
	return o;
}
function clampMag(v, max) {
	if (!Number.isFinite(v.x) || !Number.isFinite(v.y) || !Number.isFinite(v.z)) {
		v.x = 0;
		v.y = 0;
		v.z = 0;
		return v;
	}
	const L = vlen(v);
	if (L > max && L > 0) vscale(v, max / L, v);
	return v;
}
/** Rotate local axis by a unit quaternion (x,y,z,w). */
function rotateAxis(q, axis, o) {
	const lx = axis === "x" ? 1 : 0;
	const ly = axis === "y" ? 1 : 0;
	const lz = axis === "z" ? 1 : 0;
	const { x, y, z, w } = q;
	const ix = w * lx + y * lz - z * ly;
	const iy = w * ly + z * lx - x * lz;
	const iz = w * lz + x * ly - y * lx;
	const iw = -x * lx - y * ly - z * lz;
	o.x = ix * w + iw * -x + iy * -z - iz * -y;
	o.y = iy * w + iw * -y + iz * -x - ix * -z;
	o.z = iz * w + iw * -z + ix * -y - iy * -x;
	return o;
}
function coilCurrent(body) {
	if (body.kind !== "electromagnet" || !body.powered) return 0;
	return body.voltage / Math.max(body.resistance, .05);
}
/**
* Equivalent pole strength q (A·m).
* Permanent: q = M A = (Br / μ₀) A, with m = q L = (Br/μ₀) V.
* Coil: m = N I A_core μr, q = m / L.
*/
function poleStrength(body) {
	const area = poleArea(body);
	const len = poleLength(body);
	if (body.kind === "electromagnet") {
		const I = coilCurrent(body);
		const m = body.turns * I * area * body.coreMuR;
		return body.polarity * m / Math.max(len, 1e-4);
	}
	if (body.kind === "magnet") return body.polarity * body.Br * area / MU0;
	return 0;
}
function poleArea(body) {
	const [sx, sy, sz] = body.size;
	if (body.shape === "cylinder" || body.shape === "coil" || body.shape === "sphere") {
		const r = sx / 2;
		return Math.PI * r * r;
	}
	if (body.momentAxis === "y") return sx * sz;
	if (body.momentAxis === "x") return sy * sz;
	return sx * sy;
}
function poleLength(body) {
	if (body.momentAxis === "y") return body.size[1];
	if (body.momentAxis === "x") return body.size[0];
	return body.size[2];
}
function collectPoles(body, pos, quat, out) {
	if (body.kind !== "magnet" && body.kind !== "electromagnet") return;
	const axis = rotateAxis(quat, body.momentAxis, vset());
	const n = vlen(axis) || 1;
	axis.x /= n;
	axis.y /= n;
	axis.z /= n;
	if (body.shape === "horseshoe") {
		const halfW = body.size[0] * .32;
		const halfD = body.size[2] * .2;
		const q = poleStrength(body) * .85;
		const right = rotateAxis(quat, "x", vset());
		const rn = vlen(right) || 1;
		right.x /= rn;
		right.y /= rn;
		right.z /= rn;
		const fwd = rotateAxis(quat, "z", vset());
		const fn = vlen(fwd) || 1;
		fwd.x /= fn;
		fwd.y /= fn;
		fwd.z /= fn;
		out.push({
			x: pos.x + right.x * halfW + fwd.x * halfD,
			y: pos.y + right.y * halfW + fwd.y * halfD,
			z: pos.z + right.z * halfW + fwd.z * halfD,
			q,
			bodyId: body.id
		});
		out.push({
			x: pos.x - right.x * halfW + fwd.x * halfD,
			y: pos.y - right.y * halfW + fwd.y * halfD,
			z: pos.z - right.z * halfW + fwd.z * halfD,
			q: -q,
			bodyId: body.id
		});
		return;
	}
	const half = poleLength(body) * .42;
	const q = poleStrength(body);
	out.push({
		x: pos.x + axis.x * half,
		y: pos.y + axis.y * half,
		z: pos.z + axis.z * half,
		q,
		bodyId: body.id
	});
	out.push({
		x: pos.x - axis.x * half,
		y: pos.y - axis.y * half,
		z: pos.z - axis.z * half,
		q: -q,
		bodyId: body.id
	});
}
var _r = vset();
/** B of a magnetic monopole (Gilbert): (μ₀/4π) q r̂ / r² */
function bFromPoles(point, poles, excludeId, out) {
	const B = out ?? vset();
	B.x = 0;
	B.y = 0;
	B.z = 0;
	for (const pole of poles) {
		if (excludeId && pole.bodyId === excludeId) continue;
		vsub(point, pole, _r);
		let r = vlen(_r);
		if (r < R_MIN) r = R_MIN;
		const s = MU0_4PI * pole.q / (r * r * r);
		B.x += _r.x * s;
		B.y += _r.y * s;
		B.z += _r.z * s;
	}
	return B;
}
function fieldMagnitude(B) {
	return vlen(B);
}
var _B = vset();
var _F = vset();
var _sample = vset();
function solveForces(snaps, gravity) {
	const poles = [];
	for (const s of snaps) collectPoles(s.spec, s.pos, s.quat, poles);
	const forces = snaps.map((s) => ({
		id: s.spec.id,
		force: vset(),
		torque: vset(),
		forceAt: []
	}));
	const byId = new Map(forces.map((f) => [f.id, f]));
	let maxB = 0;
	for (let i = 0; i < poles.length; i++) {
		const a = poles[i];
		for (let j = i + 1; j < poles.length; j++) {
			const b = poles[j];
			if (a.bodyId === b.bodyId) continue;
			vsub(b, a, _r);
			let r = vlen(_r);
			if (r < R_MIN) r = R_MIN;
			const s = MU0_4PI * a.q * b.q / (r * r) / r;
			_F.x = _r.x * s;
			_F.y = _r.y * s;
			_F.z = _r.z * s;
			clampMag(_F, F_POLE_CAP);
			const fa = byId.get(a.bodyId);
			const fb = byId.get(b.bodyId);
			if (fa) {
				fa.force.x -= _F.x;
				fa.force.y -= _F.y;
				fa.force.z -= _F.z;
				fa.forceAt.push({
					point: {
						x: a.x,
						y: a.y,
						z: a.z
					},
					force: {
						x: -_F.x,
						y: -_F.y,
						z: -_F.z
					}
				});
			}
			if (fb) {
				fb.force.x += _F.x;
				fb.force.y += _F.y;
				fb.force.z += _F.z;
				fb.forceAt.push({
					point: {
						x: b.x,
						y: b.y,
						z: b.z
					},
					force: {
						x: _F.x,
						y: _F.y,
						z: _F.z
					}
				});
			}
		}
	}
	for (const snap of snaps) {
		const result = byId.get(snap.spec.id);
		if (!result) continue;
		const spec = snap.spec;
		bFromPoles(snap.pos, poles, spec.id, _B);
		maxB = Math.max(maxB, vlen(_B));
		if (spec.kind === "ferromagnetic") applyFerro(snap, poles, result);
		if (spec.kind === "mercury" || spec.kind === "pool") applySusceptibility(snap, poles, result);
		if (spec.kind === "conductor" || spec.kind === "tube" || spec.kind === "mercury" || spec.kind === "pool" || spec.kind === "ferromagnetic") applyEddy(snap, snaps, poles, result, byId);
		if (spec.kind !== "pool") applyPools(snap, snaps, result, gravity);
		if (spec.kind === "mercury") applyMercuryCohesion(snap, snaps, result);
		clampMag(result.force, F_BODY_CAP);
		clampMag(result.torque, TAU_CAP);
	}
	return {
		forces,
		poles,
		maxB
	};
}
function applyFerro(snap, poles, result) {
	const V = volumeOf(snap.spec.shape, snap.spec.size);
	const chi = Math.max(snap.spec.chi, 1);
	const h = Math.max(characteristicSize(snap.spec.size) * .35, .006);
	const offsets = [
		[
			h,
			0,
			0
		],
		[
			-h,
			0,
			0
		],
		[
			0,
			h,
			0
		],
		[
			0,
			-h,
			0
		],
		[
			0,
			0,
			h
		],
		[
			0,
			0,
			-h
		]
	];
	const B0 = bFromPoles(snap.pos, poles, snap.spec.id, vset());
	let Bm = vlen(B0);
	if (Bm < 1e-6) return;
	const scale = Math.min(chi * Bm / MU0, FERRO_SAT / MU0) * V / Math.max(Bm, 1e-9);
	const mx = B0.x * scale;
	const my = B0.y * scale;
	const mz = B0.z * scale;
	const dBx = vset();
	const dBy = vset();
	const dBz = vset();
	for (const [dx, dy, dz] of offsets) {
		_sample.x = snap.pos.x + dx;
		_sample.y = snap.pos.y + dy;
		_sample.z = snap.pos.z + dz;
		const B = bFromPoles(_sample, poles, snap.spec.id, vset());
		const s = 1 / (2 * h);
		if (dx > 0) {
			dBx.x += B.x * s;
			dBy.x += B.y * s;
			dBz.x += B.z * s;
		} else if (dx < 0) {
			dBx.x -= B.x * s;
			dBy.x -= B.y * s;
			dBz.x -= B.z * s;
		} else if (dy > 0) {
			dBx.y += B.x * s;
			dBy.y += B.y * s;
			dBz.y += B.z * s;
		} else if (dy < 0) {
			dBx.y -= B.x * s;
			dBy.y -= B.y * s;
			dBz.y -= B.z * s;
		} else if (dz > 0) {
			dBx.z += B.x * s;
			dBy.z += B.y * s;
			dBz.z += B.z * s;
		} else {
			dBx.z -= B.x * s;
			dBy.z -= B.y * s;
			dBz.z -= B.z * s;
		}
	}
	result.force.x += mx * dBx.x + my * dBy.x + mz * dBz.x;
	result.force.y += mx * dBx.y + my * dBy.y + mz * dBz.y;
	result.force.z += mx * dBx.z + my * dBy.z + mz * dBz.z;
	result.torque.x += my * B0.z - mz * B0.y;
	result.torque.y += mz * B0.x - mx * B0.z;
	result.torque.z += mx * B0.y - my * B0.x;
}
function applySusceptibility(snap, poles, result) {
	const chi = snap.spec.chi;
	if (Math.abs(chi) < 1e-8) return;
	const V = volumeOf(snap.spec.shape, snap.spec.size);
	const h = .008;
	const B0 = bFromPoles(snap.pos, poles, snap.spec.id, vset());
	const energyScale = chi * V / MU0;
	const dirs = [
		[
			1,
			0,
			0
		],
		[
			0,
			1,
			0
		],
		[
			0,
			0,
			1
		]
	];
	for (let i = 0; i < 3; i++) {
		const d = dirs[i];
		_sample.x = snap.pos.x + d[0] * h;
		_sample.y = snap.pos.y + d[1] * h;
		_sample.z = snap.pos.z + d[2] * h;
		const Bp = bFromPoles(_sample, poles, snap.spec.id, vset());
		_sample.x = snap.pos.x - d[0] * h;
		_sample.y = snap.pos.y - d[1] * h;
		_sample.z = snap.pos.z - d[2] * h;
		const Bm = bFromPoles(_sample, poles, snap.spec.id, vset());
		const comp = energyScale * vdot(B0, vset((Bp.x - Bm.x) / (2 * h), (Bp.y - Bm.y) / (2 * h), (Bp.z - Bm.z) / (2 * h)));
		if (i === 0) result.force.x += comp;
		if (i === 1) result.force.y += comp;
		if (i === 2) result.force.z += comp;
	}
}
function applyEddy(snap, snaps, poles, result, byId) {
	const spec = snap.spec;
	const sigma = spec.conductivity;
	if (sigma < 1) return;
	const samples = eddySamples(snap);
	const dV = volumeOf(spec.shape, spec.size) / samples.length;
	const gamma = spec.kind === "tube" ? .55 : EDDY_GEO;
	for (const sample of samples) {
		bFromPoles(sample, poles, spec.id, _B);
		const B2 = vdot(_B, _B);
		if (B2 < 1e-8) continue;
		let vx = snap.vel.x;
		let vy = snap.vel.y;
		let vz = snap.vel.z;
		const vDotB = vx * _B.x + vy * _B.y + vz * _B.z;
		const vpx = vx - vDotB * _B.x / B2;
		const vpy = vy - vDotB * _B.y / B2;
		const vpz = vz - vDotB * _B.z / B2;
		const k = gamma * sigma * dV * B2;
		const fx = -k * vpx;
		const fy = -k * vpy;
		const fz = -k * vpz;
		if (spec.kind !== "tube" && spec.kind !== "pool" && !spec.anchored) {
			result.force.x += fx;
			result.force.y += fy;
			result.force.z += fz;
		}
		for (const other of snaps) {
			if (other.spec.id === spec.id) continue;
			if (other.spec.kind !== "magnet" && other.spec.kind !== "electromagnet") continue;
			const dx = other.pos.x - sample.x;
			const dy = other.pos.y - sample.y;
			const dz = other.pos.z - sample.z;
			const reach = characteristicSize(spec.size) + characteristicSize(other.spec.size);
			if (dx * dx + dy * dy + dz * dz > reach * reach * 4) continue;
			const ovx = other.vel.x - snap.vel.x;
			const ovy = other.vel.y - snap.vel.y;
			const ovz = other.vel.z - snap.vel.z;
			const oDot = ovx * _B.x + ovy * _B.y + ovz * _B.z;
			const opx = ovx - oDot * _B.x / B2;
			const opy = ovy - oDot * _B.y / B2;
			const opz = ovz - oDot * _B.z / B2;
			const kk = gamma * sigma * dV * B2;
			const ofx = -kk * opx;
			const ofy = -kk * opy;
			const ofz = -kk * opz;
			const fo = byId.get(other.spec.id);
			if (fo) {
				fo.force.x += ofx;
				fo.force.y += ofy;
				fo.force.z += ofz;
			}
		}
		const spinK = gamma * .04 * sigma * dV * B2;
		result.torque.x -= spinK * snap.ang.x;
		result.torque.y -= spinK * snap.ang.y;
		result.torque.z -= spinK * snap.ang.z;
	}
}
function eddySamples(snap) {
	const { spec, pos } = snap;
	if (spec.kind === "tube") {
		const r = spec.size[0] / 2 - .002;
		const h = spec.size[1];
		const pts = [];
		for (let ring = -1; ring <= 1; ring++) {
			const y = pos.y + ring * (h * .32);
			for (let k = 0; k < 6; k++) {
				const a = k / 6 * Math.PI * 2;
				pts.push(vset(pos.x + Math.cos(a) * r, y, pos.z + Math.sin(a) * r));
			}
		}
		return pts;
	}
	if (spec.kind === "pool") {
		const r = spec.size[0] / 2;
		const pts = [vcopy(pos, vset())];
		for (let k = 0; k < 4; k++) {
			const a = k / 4 * Math.PI * 2;
			pts.push(vset(pos.x + Math.cos(a) * r * .55, pos.y, pos.z + Math.sin(a) * r * .55));
		}
		return pts;
	}
	return [vcopy(pos, vset())];
}
function applyPools(snap, snaps, result, gravity) {
	for (const other of snaps) {
		if (other.spec.kind !== "pool") continue;
		const pr = other.spec.size[0] / 2;
		const ph = other.spec.size[1];
		const dx = snap.pos.x - other.pos.x;
		const dz = snap.pos.z - other.pos.z;
		const rad = Math.hypot(dx, dz);
		const bodyR = characteristicSize(snap.spec.size) * .5;
		if (rad > pr + bodyR) continue;
		const surface = other.pos.y + ph / 2;
		const floor = other.pos.y - ph / 2;
		const top = snap.pos.y + bodyR;
		const bot = snap.pos.y - bodyR;
		if (bot > surface || top < floor) continue;
		const immersed = Math.max(0, Math.min(top, surface) - Math.max(bot, floor));
		const frac = Math.min(1, immersed / Math.max(2 * bodyR, 1e-4));
		const V = volumeOf(snap.spec.shape, snap.spec.size) * frac;
		const lift = other.spec.density * V * Math.abs(gravity);
		result.force.y += gravity <= 0 ? lift : -lift;
		const drag = 6 * Math.PI * .00155 * bodyR * 40;
		result.force.x -= drag * snap.vel.x;
		result.force.y -= drag * snap.vel.y;
		result.force.z -= drag * snap.vel.z;
	}
}
function applyMercuryCohesion(snap, snaps, result) {
	for (const other of snaps) {
		if (other.spec.id === snap.spec.id) continue;
		if (other.spec.kind !== "mercury" && other.spec.kind !== "pool") continue;
		vsub(other.pos, snap.pos, _r);
		const d = vlen(_r);
		const rest = other.spec.kind === "pool" ? other.spec.size[0] * .35 : (snap.spec.size[0] + other.spec.size[0]) * .42;
		if (d < 1e-4 || d > rest * 1.8) continue;
		const s = -1.8 * (d - rest) / d;
		result.force.x += _r.x * s;
		result.force.y += _r.y * s;
		result.force.z += _r.z * s;
	}
}
function formatTesla(B) {
	if (B >= .1) return `${B.toFixed(3)} T`;
	if (B >= .001) return `${(B * 1e3).toFixed(2)} mT`;
	return `${(B * 1e4).toFixed(2)} G`;
}
function dipoleMomentMagnitude(body) {
	return Math.abs(poleStrength(body) * poleLength(body));
}
function buildPreset(id) {
	switch (id) {
		case "lenz": return [createBody("copper-tube", [
			0,
			.12,
			0
		], { anchored: true }), createBody("n52-disc", [
			0,
			.34,
			0
		], { polarity: 1 })];
		case "mercury": return [
			createBody("mercury-pool", [
				0,
				.03,
				0
			], { anchored: true }),
			createBody("n52-bar", [
				.22,
				.07,
				0
			], { polarity: 1 }),
			createBody("mercury-drop", [
				-.18,
				.08,
				0
			])
		];
		case "crane": return [
			createBody("electromagnet", [
				0,
				.18,
				0
			], {
				anchored: true,
				voltage: 12,
				powered: true
			}),
			createBody("iron-block", [
				0,
				.04,
				.12
			]),
			createBody("steel-ball", [
				.1,
				.05,
				-.08
			])
		];
		case "zerog": return [
			createBody("n52-bar", [
				-.18,
				.16,
				0
			], { polarity: 1 }),
			createBody("n52-bar", [
				.18,
				.16,
				0
			], { polarity: 1 }),
			createBody("steel-ball", [
				0,
				.2,
				.16
			])
		];
		default: return [createBody("n52-bar", [
			-.18,
			.06,
			0
		], { polarity: 1 }), createBody("copper-plate", [
			.14,
			.025,
			0
		])];
	}
}
var PRESET_META = [
	{
		id: "bench",
		label: "Quiet bench",
		blurb: "One magnet, one plate — spawn more"
	},
	{
		id: "lenz",
		label: "Lenz drop",
		blurb: "Magnet through a copper tube"
	},
	{
		id: "mercury",
		label: "Mercury bath",
		blurb: "NdFeB floats on Hg"
	},
	{
		id: "crane",
		label: "EM crane",
		blurb: "Voltage lifts iron scrap"
	},
	{
		id: "zerog",
		label: "Zero-g",
		blurb: "Dipoles with gravity off"
	}
];
var simStats = {
	maxB: 0,
	maxF: 0,
	selectedB: 0
};
var SAVE_KEY = "hfps-lab-v2";
var SPAWN_SLOTS = [
	[
		-.28,
		.08,
		.18
	],
	[
		.28,
		.08,
		.18
	],
	[
		-.28,
		.08,
		-.18
	],
	[
		.28,
		.08,
		-.18
	],
	[
		0,
		.09,
		.22
	],
	[
		0,
		.09,
		-.22
	],
	[
		-.34,
		.1,
		0
	],
	[
		.34,
		.1,
		0
	]
];
function nextSpawnPos(count) {
	const slot = SPAWN_SLOTS[count % SPAWN_SLOTS.length];
	const lap = Math.floor(count / SPAWN_SLOTS.length);
	return [
		slot[0],
		slot[1] + lap * .06,
		slot[2]
	];
}
var persistTimer = null;
function quietState() {
	return {
		bodies: buildPreset("bench"),
		gravity: 9.81,
		paused: false,
		showField: false,
		showFilings: false,
		selectedId: null,
		draggingId: null,
		intro: false,
		railVoltage: 12,
		probeB: 0,
		lastForce: 0,
		epoch: 0
	};
}
function createSim() {
	return create((set, get) => ({
		...quietState(),
		spawn: (id, position) => {
			if (get().bodies.length >= 8) return;
			const item = CATALOG[id];
			const pos = position ?? nextSpawnPos(get().bodies.length);
			const extra = {};
			if (item.kind === "electromagnet") extra.voltage = get().railVoltage;
			set((s) => ({
				bodies: [...s.bodies, createBody(id, pos, extra)],
				selectedId: null
			}));
			get().persist();
		},
		remove: (id) => {
			set((s) => ({
				bodies: s.bodies.filter((b) => b.id !== id),
				selectedId: s.selectedId === id ? null : s.selectedId
			}));
			get().persist();
		},
		clear: () => {
			set((s) => ({
				bodies: [],
				selectedId: null,
				epoch: s.epoch + 1
			}));
			get().persist();
		},
		loadPreset: (id) => {
			set((s) => ({
				bodies: buildPreset(id),
				selectedId: null,
				draggingId: null,
				gravity: id === "zerog" ? 0 : 9.81,
				paused: false,
				showField: false,
				showFilings: false,
				epoch: s.epoch + 1
			}));
			get().persist();
		},
		select: (id) => set({ selectedId: id }),
		setDragging: (id) => set({ draggingId: id }),
		updateBody: (id, patch) => {
			set((s) => ({ bodies: s.bodies.map((b) => b.id === id ? {
				...b,
				...patch
			} : b) }));
			get().persist();
		},
		setGravity: (g) => set({ gravity: g }),
		setPaused: (v) => set({ paused: v }),
		togglePaused: () => set((s) => ({ paused: !s.paused })),
		setShowField: (v) => set({ showField: v }),
		setShowFilings: (v) => set({ showFilings: v }),
		setIntro: (v) => set({ intro: v }),
		setRailVoltage: (v) => set({ railVoltage: v }),
		setProbe: (B, F) => set({
			probeB: B,
			lastForce: F
		}),
		persist: () => {
			if (typeof localStorage === "undefined") return;
			if (persistTimer) clearTimeout(persistTimer);
			persistTimer = setTimeout(() => {
				try {
					localStorage.setItem(SAVE_KEY, JSON.stringify({ bodies: get().bodies }));
				} catch {}
			}, 450);
		},
		hydrate: () => {},
		resetLab: () => {
			if (persistTimer) {
				clearTimeout(persistTimer);
				persistTimer = null;
			}
			try {
				localStorage.removeItem(SAVE_KEY);
				localStorage.removeItem("hfps-lab-v1");
			} catch {}
			set({
				...quietState(),
				epoch: get().epoch + 1
			});
		}
	}));
}
var root = globalThis;
var useSim = root.__hfpsStore ??= createSim();
function Overlay() {
	const intro = useSim((s) => s.intro);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeftRail, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RightInspector, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomDock, {})
		]
	}), intro ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Intro, {}) : null] });
}
function TopBar() {
	const paused = useSim((s) => s.paused);
	const togglePaused = useSim((s) => s.togglePaused);
	const showField = useSim((s) => s.showField);
	const setShowField = useSim((s) => s.setShowField);
	const clear = useSim((s) => s.clear);
	const { user, isPending } = useCurrentUserState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "pointer-events-auto absolute top-0 right-0 left-0 flex items-center justify-between gap-3 px-3 pt-3 md:px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-w-0 items-center gap-3 rounded-lg border border-line bg-surface/90 px-3 py-2 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] tracking-[0.24em] text-muted uppercase",
					children: "HFPS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "truncate text-sm font-medium tracking-tight md:text-base",
					children: "Hitchs Fields"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 rounded-lg border border-line bg-surface/90 p-1 backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					onClick: togglePaused,
					"aria-label": paused ? "Resume" : "Pause",
					children: paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					onClick: () => setShowField(!showField),
					"aria-label": showField ? "Hide field" : "Show field",
					children: showField ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					onClick: () => useSim.getState().resetLab(),
					"aria-label": "Reset bench",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ghost",
					onClick: clear,
					"aria-label": "Clear world",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 hidden h-5 w-px bg-line sm:block" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center pr-1 sm:flex",
					children: isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-7 animate-pulse rounded-full bg-surface-2" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "px-2 text-xs text-muted hover:text-fg",
						children: "Sign in"
					}) })
				})
			]
		})]
	});
}
function LeftRail() {
	const spawn = useSim((s) => s.spawn);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "pointer-events-auto absolute top-20 bottom-28 left-3 hidden w-44 flex-col max-md:hidden md:flex",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto rounded-lg border border-line bg-surface/90 p-2 backdrop-blur-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-1 pb-2 font-mono text-[10px] tracking-[0.18em] text-muted uppercase",
				children: "Spawn"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-1",
				children: SPAWN_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => spawn(id),
					className: "flex items-center justify-between rounded-sm px-2 py-1.5 text-left text-xs text-fg transition-colors hover:bg-surface-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: CATALOG[id].label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] text-faint",
						children: CATALOG[id].short
					})]
				}, id))
			})]
		})
	});
}
function RightInspector() {
	const selectedId = useSim((s) => s.selectedId);
	const body = useSim((s) => s.bodies.find((b) => b.id === selectedId) ?? null);
	const updateBody = useSim((s) => s.updateBody);
	const remove = useSim((s) => s.remove);
	const [liveB, setLiveB] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setLiveB(simStats.selectedB), 200);
		return () => window.clearInterval(t);
	}, []);
	if (!body) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "pointer-events-none absolute top-20 right-3 hidden w-64 max-md:hidden md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-line bg-surface/80 p-4 text-sm text-muted backdrop-blur-sm",
			children: "Click a body to inspect remnant field, voltage, mass, and polarity. The bench starts quiet — spawn items from the left rail. Drag to move. Shift-drag to lift."
		})
	});
	const item = CATALOG[body.catalogId];
	const I = coilCurrent(body);
	const m = dipoleMomentMagnitude(body);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "pointer-events-auto absolute top-20 right-3 bottom-28 hidden w-72 overflow-y-auto max-md:hidden md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-line bg-surface/92 p-3 backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] tracking-[0.16em] text-muted uppercase",
						children: body.kind
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: body.label
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon-sm",
						variant: "ghost",
						onClick: () => remove(body.id),
						"aria-label": "Delete body",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[11px] leading-relaxed text-muted",
					children: item.notes
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-[10px] text-faint",
					children: item.source
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Mass",
							v: `${body.mass.toFixed(3)} kg`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "ρ",
							v: `${body.density.toFixed(0)} kg/m³`
						}),
						body.Br > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Br",
							v: `${body.Br.toFixed(2)} T`
						}) : null,
						m > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "m",
							v: `${m.toFixed(3)} A·m²`
						}) : null,
						body.kind === "electromagnet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "I",
							v: `${I.toFixed(2)} A`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "N",
							v: `${body.turns} turns`
						})] }) : null,
						body.conductivity > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "σ",
							v: body.conductivity.toExponential(2)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "B ext",
							v: formatTesla(liveB)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabeledSlider, {
							label: "Mass",
							unit: "kg",
							value: body.mass,
							min: .008,
							max: 2,
							step: .002,
							onChange: (v) => updateBody(body.id, { mass: v })
						}),
						body.kind === "electromagnet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabeledSlider, {
							label: "Voltage",
							unit: "V",
							value: body.voltage,
							min: 0,
							max: 48,
							step: .5,
							onChange: (v) => updateBody(body.id, { voltage: v })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: body.powered ? "default" : "outline",
								className: "flex-1",
								onClick: () => updateBody(body.id, { powered: !body.powered }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }), body.powered ? "Powered" : "Off"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => updateBody(body.id, { polarity: body.polarity === 1 ? -1 : 1 }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal, { className: "size-3.5" }), "Flip"]
							})]
						})] }) : null,
						body.kind === "magnet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: body.polarity === 1 ? "north" : "outline",
								className: "flex-1",
								onClick: () => updateBody(body.id, { polarity: 1 }),
								children: "N up"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: body.polarity === -1 ? "south" : "outline",
								className: "flex-1",
								onClick: () => updateBody(body.id, { polarity: -1 }),
								children: "S up"
							})]
						}) : null,
						body.kind !== "pool" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: body.anchored ? "default" : "outline",
							className: "w-full",
							onClick: () => updateBody(body.id, { anchored: !body.anchored }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, { className: "size-3.5" }), body.anchored ? "Anchored" : "Free body"]
						}) : null
					]
				})
			]
		})
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-faint",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "text-fg tabular-nums",
		children: v
	})] });
}
function LabeledSlider({ label, unit, value, min, max, step, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1 flex justify-between text-[11px] text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono tabular-nums text-fg",
				children: [
					value.toFixed(step < .1 ? 2 : 1),
					" ",
					unit
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
			min,
			max,
			step,
			value: [value],
			onValueChange: (v) => onChange(v[0] ?? value)
		})]
	});
}
function BottomDock() {
	const gravity = useSim((s) => s.gravity);
	const setGravity = useSim((s) => s.setGravity);
	const railVoltage = useSim((s) => s.railVoltage);
	const setRailVoltage = useSim((s) => s.setRailVoltage);
	const showFilings = useSim((s) => s.showFilings);
	const setShowFilings = useSim((s) => s.setShowFilings);
	const loadPreset = useSim((s) => s.loadPreset);
	const spawn = useSim((s) => s.spawn);
	const bodyCount = useSim((s) => s.bodies.length);
	const [probe, setProbe] = (0, import_react.useState)({
		B: 0,
		F: 0
	});
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setProbe({
			B: simStats.maxB,
			F: simStats.maxF
		}), 200);
		return () => window.clearInterval(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-auto absolute right-3 bottom-3 left-3 md:left-52 md:right-80",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 flex gap-1 overflow-x-auto md:hidden",
			children: SPAWN_ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => spawn(id),
				className: "shrink-0 rounded-sm border border-line bg-surface px-2.5 py-2 text-[11px] text-fg",
				children: CATALOG[id].short
			}, id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-line bg-surface/92 p-3 backdrop-blur-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex flex-wrap gap-1.5",
					children: PRESET_META.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => loadPreset(p.id),
						className: "rounded-sm border border-line px-2 py-1 text-[11px] text-muted transition-colors hover:border-accent hover:text-fg",
						title: p.blurb,
						children: p.label
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabeledSlider, {
						label: "Gravity",
						unit: "m/s²",
						value: gravity,
						min: 0,
						max: 20,
						step: .01,
						onChange: setGravity
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabeledSlider, {
						label: "Rail voltage",
						unit: "V",
						value: railVoltage,
						min: 0,
						max: 48,
						step: .5,
						onChange: setRailVoltage
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums",
						children: [
							bodyCount,
							"/",
							8,
							" · |B|max ",
							formatTesla(probe.B),
							" · |F|max ",
							probe.F.toFixed(2),
							" N"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setShowFilings(!showFilings),
						className: cn("rounded-sm border px-2 py-1 text-[10px]", showFilings ? "border-accent text-fg" : "border-line text-muted hover:text-fg"),
						children: ["Filings ", showFilings ? "on" : "off"]
					})]
				})
			]
		})]
	});
}
function Intro() {
	const setIntro = useSim((s) => s.setIntro);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-auto absolute inset-0 z-50 grid place-items-center bg-bg/72 px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl border border-line bg-surface p-6 md:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] tracking-[0.28em] text-muted uppercase",
					children: "HFPS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl font-medium tracking-tight",
					children: "Hitchs Fields"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Physics Simulation"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted",
					children: "Tabletop electromagnetism with published magnet grades, Gilbert pole fields, Faraday eddy drag, and a real mercury bath — NdFeB floats."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-1.5 text-sm text-fg/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Drag bodies · Shift-drag to lift" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "WASD pans the bench · Q/E raise the view" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Space pauses · F toggles field lines" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "default",
					className: "mt-6 h-11 w-full",
					onClick: () => setIntro(false),
					children: "Enter the lab"
				})
			]
		})
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
var playgroundLoad = typeof document !== "undefined" ? import("./Playground-CTjxf0Uh.mjs") : null;
function Home() {
	const [Scene, setScene] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [sceneKey, setSceneKey] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		useSim.getState().hydrate();
		let cancelled = false;
		(playgroundLoad ?? import("./Playground-CTjxf0Uh.mjs")).then((mod) => {
			if (!cancelled) setScene(() => mod.Scene);
		}).catch((e) => {
			if (!cancelled) setErr(e instanceof Error ? e.message : String(e));
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const resetLab = () => {
		useSim.getState().resetLab();
		setErr(null);
		setSceneKey((k) => k + 1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 z-20 grid place-items-center px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-medium",
						children: "Lab failed to load"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: err
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-5 h-10 rounded-md bg-fg px-4 text-sm text-bg",
						onClick: resetLab,
						children: "Try again"
					})
				]
			})
		}) : Scene ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabErrorBoundary, {
			onReset: resetLab,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {})
		}, sceneKey) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] tracking-[0.28em] text-muted uppercase",
					children: "HFPS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Warming the bench…"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {})]
	});
}
//#endregion
export { bFromPoles as a, solveForces as c, simStats as i, vlen as l, Overlay as n, collectPoles as o, useSim as r, fieldMagnitude as s, routes_exports as t };
