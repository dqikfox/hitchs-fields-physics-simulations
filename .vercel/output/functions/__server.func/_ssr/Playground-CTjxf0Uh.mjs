import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Vector3, f as Object3D, g as Vector2, h as Raycaster, i as useThree, n as Canvas, p as Plane, r as useFrame, t as OrbitControls, u as MathUtils } from "../_libs/@react-three/drei+[...].mjs";
import { a as bFromPoles, c as solveForces, i as simStats, l as vlen, n as Overlay, o as collectPoles, r as useSim, s as fieldMagnitude } from "./routes-CWhjF1MY.mjs";
import { a as useBeforePhysicsStep, i as RigidBody, n as CylinderCollider, r as Physics, t as CuboidCollider } from "../_libs/@react-three/rapier+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Playground-CTjxf0Uh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RegistryContext = (0, import_react.createContext)(/* @__PURE__ */ new Map());
function useBodyRegistry() {
	return (0, import_react.useContext)(RegistryContext);
}
function Bodies() {
	const bodies = useSim((s) => s.bodies);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: bodies.map((body) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimBodyMesh, { spec: body }, body.id)) });
}
function SimBodyMesh({ spec }) {
	const registry = useBodyRegistry();
	const select = useSim((s) => s.select);
	const selected = useSim((s) => s.selectedId === spec.id);
	const rbRef = (0, import_react.useRef)(null);
	const type = spec.kind === "pool" ? "fixed" : spec.anchored ? "kinematicPosition" : "dynamic";
	const bind = (rb) => {
		rbRef.current = rb;
		if (rb) registry.set(spec.id, rb);
		else registry.delete(spec.id);
	};
	const onDown = (e) => {
		e.stopPropagation();
		select(spec.id);
		if (spec.kind === "pool") return;
		const rb = rbRef.current;
		if (!rb) return;
		const t = rb.translation();
		const grab = e.point;
		dragOffset.x = t.x - grab.x;
		dragOffset.y = t.y - grab.y;
		dragOffset.z = t.z - grab.z;
		dragPlaneY = grab.y;
		useSim.getState().setDragging(spec.id);
	};
	const autoColliders = spec.shape === "box" ? "cuboid" : spec.shape === "sphere" ? "ball" : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: bind,
		position: spec.position,
		rotation: spec.rotation,
		type,
		mass: spec.mass,
		colliders: autoColliders,
		linearDamping: .42,
		angularDamping: .58,
		friction: .62,
		restitution: .08,
		ccd: spec.kind === "magnet" || spec.shape === "sphere",
		canSleep: true,
		children: [
			spec.shape === "tube" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TubeColliders, { spec }) : null,
			spec.shape === "horseshoe" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HorseshoeColliders, { spec }) : null,
			spec.shape === "coil" || spec.shape === "cylinder" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CylinderCollider, { args: [spec.size[1] / 2, spec.size[0] / 2] }) : null,
			spec.shape === "pool" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CylinderCollider, {
				args: [.002, spec.size[0] / 2],
				position: [
					0,
					-spec.size[1] / 2,
					0
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
				onPointerDown: onDown,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BodyVisual, {
					spec,
					selected
				})
			})
		]
	});
}
var dragOffset = {
	x: 0,
	y: 0,
	z: 0
};
var dragPlaneY = .08;
function TubeColliders({ spec }) {
	const r = spec.size[0] / 2;
	const h = spec.size[1];
	const t = .0035;
	const n = 6;
	const seg = 2 * Math.PI * r / n * .62;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: Array.from({ length: n }, (_, i) => {
		const a = i / n * Math.PI * 2;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				t,
				h / 2,
				seg
			],
			position: [
				Math.cos(a) * (r - t),
				0,
				Math.sin(a) * (r - t)
			],
			rotation: [
				0,
				-a,
				0
			]
		}, i);
	}) });
}
function HorseshoeColliders({ spec }) {
	const [sx, sy, sz] = spec.size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				sx * .12,
				sy * .45,
				sz * .45
			],
			position: [
				-sx * .32,
				0,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				sx * .12,
				sy * .45,
				sz * .45
			],
			position: [
				sx * .32,
				0,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
			args: [
				sx * .48,
				sy * .14,
				sz * .45
			],
			position: [
				0,
				sy * .28,
				0
			]
		})
	] });
}
function BodyVisual({ spec, selected }) {
	const outline = selected ? .012 : 0;
	switch (spec.shape) {
		case "box": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarVisual, {
			spec,
			outline
		});
		case "cylinder": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscVisual, {
			spec,
			outline
		});
		case "sphere": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SphereVisual, {
			spec,
			outline
		});
		case "coil": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoilVisual, {
			spec,
			outline
		});
		case "horseshoe": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HorseshoeVisual, {
			spec,
			outline
		});
		case "tube": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TubeVisual, {
			spec,
			outline
		});
		case "pool": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoolVisual, {
			spec,
			selected
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarVisual, {
			spec,
			outline
		});
	}
}
function northColor(polarity) {
	return polarity === 1 ? "#c45c5c" : "#4d7ab8";
}
function southColor(polarity) {
	return polarity === 1 ? "#4d7ab8" : "#c45c5c";
}
function BarVisual({ spec, outline }) {
	const [sx, sy, sz] = spec.size;
	const axis = spec.momentAxis;
	const isMag = spec.kind === "magnet";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [isMag && axis === "z" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			0,
			sz * .25
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			sx,
			sy,
			sz * .5
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: northColor(spec.polarity),
			metalness: .55,
			roughness: .38,
			emissive: northColor(spec.polarity),
			emissiveIntensity: .08
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			0,
			-sz * .25
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			sx,
			sy,
			sz * .5
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: southColor(spec.polarity),
			metalness: .55,
			roughness: .38,
			emissive: southColor(spec.polarity),
			emissiveIntensity: .08
		})]
	})] }) : isMag && axis === "y" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			sy * .25,
			0
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			sx,
			sy * .5,
			sz
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: northColor(spec.polarity),
			metalness: .55,
			roughness: .38,
			emissive: northColor(spec.polarity),
			emissiveIntensity: .08
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			-sy * .25,
			0
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			sx,
			sy * .5,
			sz
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: southColor(spec.polarity),
			metalness: .55,
			roughness: .38,
			emissive: southColor(spec.polarity),
			emissiveIntensity: .08
		})]
	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			sx,
			sy,
			sz
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: spec.color,
			metalness: spec.kind === "conductor" ? .85 : .4,
			roughness: spec.kind === "conductor" ? .28 : .5
		})]
	}), outline > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
		sx + outline,
		sy + outline,
		sz + outline
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
		color: "#e8e6e1",
		wireframe: true,
		transparent: true,
		opacity: .5
	})] }) : null] });
}
function DiscVisual({ spec, outline }) {
	const r = spec.size[0] / 2;
	const h = spec.size[1];
	const mag = spec.kind === "magnet";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [mag ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			h * .25,
			0
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			r,
			r,
			h * .5,
			16
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: northColor(spec.polarity),
			metalness: .58,
			roughness: .32,
			emissive: northColor(spec.polarity),
			emissiveIntensity: .08
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			-h * .25,
			0
		],
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			r,
			r,
			h * .5,
			16
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: southColor(spec.polarity),
			metalness: .58,
			roughness: .32,
			emissive: southColor(spec.polarity),
			emissiveIntensity: .08
		})]
	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			r,
			r,
			h,
			18
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: spec.color,
			metalness: .82,
			roughness: .26
		})]
	}), outline > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
		r + outline,
		r + outline,
		h + outline,
		16
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
		color: "#e8e6e1",
		wireframe: true,
		transparent: true,
		opacity: .45
	})] }) : null] });
}
function SphereVisual({ spec, outline }) {
	const r = spec.size[0] / 2;
	const mercury = spec.kind === "mercury";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		castShadow: true,
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			r,
			16,
			12
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: spec.color,
			metalness: mercury ? .55 : .7,
			roughness: mercury ? .32 : .35
		})]
	}), outline > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
		r + outline,
		12,
		10
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
		color: "#e8e6e1",
		wireframe: true,
		transparent: true,
		opacity: .45
	})] }) : null] });
}
function CoilVisual({ spec, outline }) {
	const r = spec.size[0] / 2;
	const h = spec.size[1];
	const live = spec.powered && spec.voltage > .2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				r * .38,
				r * .38,
				h * .92,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3d4046",
				metalness: .7,
				roughness: .35
			})]
		}),
		[
			-.28,
			.04,
			.34
		].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				h * t,
				0
			],
			rotation: [
				Math.PI / 2,
				0,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				r * .62,
				r * .1,
				6,
				14
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#b87333",
				metalness: .85,
				roughness: .28,
				emissive: live ? "#b87333" : "#000000",
				emissiveIntensity: live ? .18 : 0
			})]
		}, t)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				h * .48,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				r * .38,
				r * .38,
				.004,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: northColor(spec.polarity),
				emissive: northColor(spec.polarity),
				emissiveIntensity: live ? .35 : .05
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-h * .48,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				r * .38,
				r * .38,
				.004,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: southColor(spec.polarity),
				emissive: southColor(spec.polarity),
				emissiveIntensity: live ? .35 : .05
			})]
		}),
		outline > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			r + .004,
			r + .004,
			h + .01,
			12
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#e8e6e1",
			wireframe: true,
			transparent: true,
			opacity: .4
		})] }) : null
	] });
}
function HorseshoeVisual({ spec, outline }) {
	const [sx, sy, sz] = spec.size;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-sx * .32,
				0,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				sx * .24,
				sy,
				sz
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: northColor(spec.polarity),
				metalness: .45,
				roughness: .45
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				sx * .32,
				0,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				sx * .24,
				sy,
				sz
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: southColor(spec.polarity),
				metalness: .45,
				roughness: .45
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				sy * .3,
				0
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				sx,
				sy * .28,
				sz
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#8a3d3d",
				metalness: .4,
				roughness: .5
			})]
		}),
		outline > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			sx + .01,
			sy + .01,
			sz + .01
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#e8e6e1",
			wireframe: true,
			transparent: true,
			opacity: .35
		})] }) : null
	] });
}
function TubeVisual({ spec, outline }) {
	const r = spec.size[0] / 2;
	const h = spec.size[1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				r,
				r,
				h,
				18,
				1,
				true
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#b87333",
				metalness: .86,
				roughness: .24,
				side: 2
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			r - .0035,
			r - .0035,
			h,
			18,
			1,
			true
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#8a5524",
			metalness: .8,
			roughness: .3,
			side: 2
		})] }),
		outline > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			r + .004,
			r + .004,
			h + .008,
			12,
			1,
			true
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#e8e6e1",
			wireframe: true,
			transparent: true,
			opacity: .4
		})] }) : null
	] });
}
function PoolVisual({ spec, selected }) {
	const r = spec.size[0] / 2;
	const h = spec.size[1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-h * .15,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				r + .008,
				r + .01,
				h * .7,
				24
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#2a2d32",
				metalness: .4,
				roughness: .55
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				h * .12,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				r,
				r,
				h * .55,
				24
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#b7bbc0",
				metalness: .42,
				roughness: .38
			})]
		}),
		selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				h * .4,
				0
			],
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				r + .002,
				r + .008,
				24
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#e8e6e1",
				transparent: true,
				opacity: .5
			})]
		}) : null
	] });
}
var LINE_COUNT = 12;
var STEPS = 18;
var DS = .011;
var SEED_RING = 4;
var _p = new Vector3();
var _b = {
	x: 0,
	y: 0,
	z: 0
};
var _pos = {
	x: 0,
	y: 0,
	z: 0
};
function FieldVis() {
	const showField = useSim((s) => s.showField);
	const showFilings = useSim((s) => s.showFilings);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [showField ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLines, {}) : null, showFilings ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldFilings, {}) : null] });
}
function FieldLines() {
	const registry = useBodyRegistry();
	const posArr = (0, import_react.useMemo)(() => /* @__PURE__ */ new Float32Array(1296), []);
	const colArr = (0, import_react.useMemo)(() => /* @__PURE__ */ new Float32Array(1296), []);
	const geom = (0, import_react.useRef)(null);
	const poles = (0, import_react.useRef)([]);
	const tick = (0, import_react.useRef)(0);
	useFrame(() => {
		const g = geom.current;
		if (!g) return;
		tick.current += 1;
		const bodies = useSim.getState().bodies;
		const skip = bodies.reduce((n, b) => n + (b.kind === "magnet" || b.kind === "electromagnet" ? 1 : 0), 0) > 3 ? 4 : 3;
		if (tick.current % skip !== 0) return;
		poles.current.length = 0;
		for (const spec of bodies) {
			const rb = registry.get(spec.id);
			if (!rb) continue;
			const t = rb.translation();
			const r = rb.rotation();
			_pos.x = t.x;
			_pos.y = t.y;
			_pos.z = t.z;
			collectPoles(spec, _pos, r, poles.current);
		}
		const seeds = gatherSeeds(poles.current);
		let cursor = 0;
		const maxSeg = 216;
		for (const seed of seeds) {
			if (cursor >= maxSeg) break;
			_p.set(seed.x, seed.y, seed.z);
			for (let s = 0; s < STEPS; s++) {
				if (cursor >= maxSeg) break;
				_pos.x = _p.x;
				_pos.y = _p.y;
				_pos.z = _p.z;
				bFromPoles(_pos, poles.current, void 0, _b);
				const mag = fieldMagnitude(_b);
				const len = Math.hypot(_b.x, _b.y, _b.z);
				const ax = _p.x;
				const ay = _p.y;
				const az = _p.z;
				if (len < 1e-6 || mag < 2e-5) {
					_p.x += seed.sx * DS;
					_p.y += seed.sy * DS;
					_p.z += seed.sz * DS;
				} else {
					const inv = DS * seed.dir / len;
					_p.x += _b.x * inv;
					_p.y += _b.y * inv;
					_p.z += _b.z * inv;
				}
				const i = cursor * 6;
				posArr[i] = ax;
				posArr[i + 1] = ay;
				posArr[i + 2] = az;
				posArr[i + 3] = _p.x;
				posArr[i + 4] = _p.y;
				posArr[i + 5] = _p.z;
				const t = colorT(mag);
				const cr = .49 + t * .4;
				const cg = .61 + t * .2;
				const cb = .56 + t * .22;
				colArr[i] = cr;
				colArr[i + 1] = cg;
				colArr[i + 2] = cb;
				colArr[i + 3] = cr;
				colArr[i + 4] = cg;
				colArr[i + 5] = cb;
				cursor++;
				if (_p.y < -.02 || _p.y > .7 || Math.hypot(_p.x, _p.z) > .9) break;
			}
		}
		while (cursor < maxSeg) {
			const i = cursor * 6;
			posArr[i] = posArr[i + 3] = 0;
			posArr[i + 1] = posArr[i + 4] = -10;
			posArr[i + 2] = posArr[i + 5] = 0;
			cursor++;
		}
		const pa = g.getAttribute("position");
		const ca = g.getAttribute("color");
		if (pa) pa.needsUpdate = true;
		if (ca) ca.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("lineSegments", {
		frustumCulled: false,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("bufferGeometry", {
			ref: geom,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("float32BufferAttribute", {
				attach: "attributes-position",
				args: [posArr, 3]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("float32BufferAttribute", {
				attach: "attributes-color",
				args: [colArr, 3]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", {
			vertexColors: true,
			transparent: true,
			opacity: .72,
			depthWrite: false
		})]
	});
}
function gatherSeeds(poles) {
	const seeds = [];
	const byBody = /* @__PURE__ */ new Map();
	for (const p of poles) {
		const list = byBody.get(p.bodyId) ?? [];
		list.push(p);
		byBody.set(p.bodyId, list);
	}
	for (const group of byBody.values()) {
		const north = group.find((p) => p.q > 0) ?? group[0];
		const south = group.find((p) => p.q < 0) ?? group[group.length - 1];
		if (!north || !south) continue;
		const dx = north.x - south.x;
		const dy = north.y - south.y;
		const dz = north.z - south.z;
		const L = Math.hypot(dx, dy, dz) || 1;
		const ux = dx / L;
		const uy = dy / L;
		const uz = dz / L;
		const px = Math.abs(uy) < .9 ? 0 : 1;
		const py = Math.abs(uy) < .9 ? 1 : 0;
		const pz = 0;
		const sx = uy * pz - uz * py;
		const sy = uz * px - ux * pz;
		const sz = ux * py - uy * px;
		const sl = Math.hypot(sx, sy, sz) || 1;
		for (let i = 0; i < SEED_RING; i++) {
			const a = i / SEED_RING * Math.PI * 2;
			const ca = Math.cos(a);
			const sa = Math.sin(a);
			const rx = sx / sl * ca + (uy * sz - uz * sy) * sa;
			const ry = sy / sl * ca + (uz * sx - ux * sz) * sa;
			const rz = sz / sl * ca + (ux * sy - uy * sx) * sa;
			const rad = .006;
			seeds.push({
				x: north.x + rx * rad + ux * .002,
				y: north.y + ry * rad + uy * .002,
				z: north.z + rz * rad + uz * .002,
				dir: 1,
				sx: ux,
				sy: uy,
				sz: uz
			});
		}
	}
	return seeds.slice(0, LINE_COUNT);
}
function colorT(mag) {
	return Math.min(1, Math.max(0, (Math.log10(Math.max(mag, 1e-6)) + 4) / 4));
}
var FILINGS = 6;
function FieldFilings() {
	const registry = useBodyRegistry();
	const mesh = (0, import_react.useRef)(null);
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	const poles = (0, import_react.useRef)([]);
	const up = (0, import_react.useMemo)(() => new Vector3(0, 1, 0), []);
	const dir = (0, import_react.useMemo)(() => new Vector3(), []);
	const tick = (0, import_react.useRef)(0);
	useFrame(() => {
		const inst = mesh.current;
		if (!inst) return;
		tick.current += 1;
		if (tick.current % 2 !== 0) return;
		const bodies = useSim.getState().bodies;
		poles.current.length = 0;
		for (const spec of bodies) {
			const rb = registry.get(spec.id);
			if (!rb) continue;
			const t = rb.translation();
			const r = rb.rotation();
			collectPoles(spec, {
				x: t.x,
				y: t.y,
				z: t.z
			}, r, poles.current);
		}
		let i = 0;
		for (let ix = 0; ix < FILINGS; ix++) for (let iz = 0; iz < FILINGS; iz++) {
			const x = -.42 + ix / 5 * .84;
			const z = -.3 + iz / 5 * .6;
			const y = .018;
			bFromPoles({
				x,
				y,
				z
			}, poles.current, void 0, _b);
			dummy.position.set(x, y, z);
			dir.set(_b.x, _b.y, _b.z);
			if (dir.lengthSq() < 1e-10) dummy.scale.setScalar(0);
			else {
				dir.normalize();
				dummy.quaternion.setFromUnitVectors(up, dir);
				const s = .35 + Math.min(1.4, fieldMagnitude(_b) * 40);
				dummy.scale.set(s, s, s);
			}
			dummy.updateMatrix();
			inst.setMatrixAt(i, dummy.matrix);
			i++;
		}
		inst.instanceMatrix.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: mesh,
		args: [
			void 0,
			void 0,
			36
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
			.003,
			.012,
			5
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#7d9b8e",
			transparent: true,
			opacity: .7
		})]
	});
}
function MagnetForces() {
	const registry = useBodyRegistry();
	const snaps = (0, import_react.useRef)([]);
	useBeforePhysicsStep(() => {
		try {
			stepForces(registry, snaps.current);
		} catch {}
	});
	return null;
}
function stepForces(registry, list) {
	const { bodies, gravity, paused, selectedId } = useSim.getState();
	if (paused) return;
	if (typeof document !== "undefined" && document.hidden) return;
	list.length = 0;
	for (const spec of bodies) {
		const rb = registry.get(spec.id);
		if (!rb) continue;
		const t = rb.translation();
		if (!Number.isFinite(t.x) || !Number.isFinite(t.y) || !Number.isFinite(t.z) || escaped(t)) {
			rb.setTranslation({
				x: spec.position[0],
				y: spec.position[1],
				z: spec.position[2]
			}, true);
			rb.setLinvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			rb.setAngvel({
				x: 0,
				y: 0,
				z: 0
			}, true);
			continue;
		}
		const r = rb.rotation();
		const v = rb.linvel();
		const w = rb.angvel();
		list.push({
			spec,
			pos: {
				x: t.x,
				y: t.y,
				z: t.z
			},
			quat: {
				x: r.x,
				y: r.y,
				z: r.z,
				w: r.w
			},
			vel: {
				x: v.x,
				y: v.y,
				z: v.z
			},
			ang: {
				x: w.x,
				y: w.y,
				z: w.z
			}
		});
	}
	const { forces, poles, maxB } = solveForces(list, gravity);
	let maxF = 0;
	let selectedB = 0;
	for (const f of forces) {
		const rb = registry.get(f.id);
		if (!rb) continue;
		rb.resetForces(true);
		rb.resetTorques(true);
		if (!Number.isFinite(f.force.x) || !Number.isFinite(f.torque.x)) continue;
		const mag = vlen(f.force);
		maxF = Math.max(maxF, mag);
		if (!rb.isDynamic()) continue;
		rb.addForce(f.force, true);
		rb.addTorque(f.torque, true);
		if (mag > .02) rb.wakeUp();
	}
	if (selectedId) {
		const snap = list.find((s) => s.spec.id === selectedId);
		if (snap) {
			const B = bFromPoles(snap.pos, poles, snap.spec.id);
			selectedB = vlen(B);
		}
	}
	simStats.maxB = maxB;
	simStats.maxF = maxF;
	simStats.selectedB = selectedB;
}
function escaped(t) {
	return Math.abs(t.x) > 1.35 || t.y > 1.5 || t.y < -.35 || Math.abs(t.z) > 1.05;
}
function World() {
	const gravity = useSim((s) => s.gravity);
	const paused = useSim((s) => s.paused);
	const draggingId = useSim((s) => s.draggingId);
	const epoch = useSim((s) => s.epoch);
	const [tabHidden, setTabHidden] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onVis = () => setTabHidden(document.hidden);
		document.addEventListener("visibilitychange", onVis);
		return () => document.removeEventListener("visibilitychange", onVis);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#0b0c0e"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				"#0b0c0e",
				1.6,
				4.2
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#d8d4cc",
			"#1a1c20",
			.55
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				.7,
				1.4,
				.5
			],
			intensity: 1.35
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			position: [
				-.6,
				.5,
				-.4
			],
			intensity: .25,
			color: "#8aa0b8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			makeDefault: true,
			enableDamping: true,
			dampingFactor: .08,
			enablePan: true,
			enabled: !draggingId,
			minDistance: .18,
			maxDistance: 2.4,
			maxPolarAngle: Math.PI * .49,
			target: [
				0,
				.06,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragController, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.025,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.5,
				.05,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#16181c",
				metalness: .35,
				roughness: .62
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
				gravity: [
					0,
					-gravity,
					0
				],
				timeStep: "vary",
				paused: paused || tabHidden,
				interpolate: false,
				debug: false,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bodies, {}, epoch),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MagnetForces, {})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldVis, {})
	] });
}
function Table() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			friction: .7,
			restitution: .05,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.025,
					0
				],
				receiveShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					1.5,
					.05,
					1
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#16181c",
					metalness: .35,
					roughness: .62
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
			type: "fixed",
			colliders: false,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
					args: [
						.02,
						.34,
						.52
					],
					position: [
						-.77,
						.34,
						0
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
					args: [
						.02,
						.34,
						.52
					],
					position: [
						.77,
						.34,
						0
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
					args: [
						.77,
						.34,
						.02
					],
					position: [
						0,
						.34,
						-.52
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
					args: [
						.77,
						.34,
						.02
					],
					position: [
						0,
						.34,
						.52
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuboidCollider, {
					args: [
						.78,
						.02,
						.52
					],
					position: [
						0,
						.72,
						0
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("gridHelper", {
			args: [
				1.5,
				15,
				"#2a2d34",
				"#1c1f26"
			],
			position: [
				0,
				.001,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.052,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.56,
				.02,
				1.06
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#0e1013",
				metalness: .2,
				roughness: .8
			})]
		})
	] });
}
function CameraRig() {
	const keys = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const { camera, controls } = useThree();
	const forward = (0, import_react.useMemo)(() => new Vector3(), []);
	const right = (0, import_react.useMemo)(() => new Vector3(), []);
	const worldUp = (0, import_react.useMemo)(() => new Vector3(0, 1, 0), []);
	const move = (0, import_react.useMemo)(() => new Vector3(), []);
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			if (isTyping(e)) return;
			keys.current.add(e.code);
		};
		const upKey = (e) => keys.current.delete(e.code);
		const clear = () => keys.current.clear();
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", upKey);
		window.addEventListener("blur", clear);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", upKey);
			window.removeEventListener("blur", clear);
		};
	}, []);
	useFrame((_, dt) => {
		const d = Math.min(dt, .1);
		const orbit = controls;
		if (!orbit) return;
		const k = keys.current;
		camera.getWorldDirection(forward);
		forward.y = 0;
		if (forward.lengthSq() < 1e-6) forward.set(0, 0, -1);
		forward.normalize();
		right.crossVectors(forward, worldUp).normalize();
		let sx = 0;
		let sz = 0;
		let sy = 0;
		if (k.has("KeyA") || k.has("ArrowLeft")) sx -= 1;
		if (k.has("KeyD") || k.has("ArrowRight")) sx += 1;
		if (k.has("KeyW") || k.has("ArrowUp")) sz += 1;
		if (k.has("KeyS") || k.has("ArrowDown")) sz -= 1;
		if (k.has("KeyQ")) sy -= 1;
		if (k.has("KeyE")) sy += 1;
		if (!sx && !sz && !sy) return;
		const speed = (k.has("ShiftLeft") || k.has("ShiftRight") ? .9 : .42) * d;
		move.set(0, 0, 0).addScaledVector(right, sx * speed).addScaledVector(forward, sz * speed).addScaledVector(worldUp, sy * speed);
		orbit.target.add(move);
		camera.position.add(move);
	});
	return null;
}
function DragController() {
	const registry = useBodyRegistry();
	const draggingId = useSim((s) => s.draggingId);
	const setDragging = useSim((s) => s.setDragging);
	const { camera, gl } = useThree();
	const raycaster = (0, import_react.useMemo)(() => new Raycaster(), []);
	const pointer = (0, import_react.useMemo)(() => new Vector2(), []);
	const plane = (0, import_react.useMemo)(() => new Plane(new Vector3(0, 1, 0), 0), []);
	const hit = (0, import_react.useMemo)(() => new Vector3(), []);
	const planeN = (0, import_react.useMemo)(() => new Vector3(), []);
	const camDir = (0, import_react.useMemo)(() => new Vector3(), []);
	const shift = (0, import_react.useRef)(false);
	const last = (0, import_react.useRef)(new Vector3());
	const lastT = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const onUp = () => {
			const id = useSim.getState().draggingId;
			if (!id) return;
			const rb = registry.get(id);
			if (rb) {
				setBodyTypeSafe(rb, useSim.getState().bodies.find((b) => b.id === id)?.anchored ? 2 : 0);
				const now = performance.now();
				const dt = Math.max((now - lastT.current) / 1e3, 1 / 120);
				const t = rb.translation();
				const vx = (t.x - last.current.x) / dt;
				const vy = (t.y - last.current.y) / dt;
				const vz = (t.z - last.current.z) / dt;
				rb.setLinvel({
					x: MathUtils.clamp(vx, -1.5, 1.5),
					y: MathUtils.clamp(vy, -1.5, 1.5),
					z: MathUtils.clamp(vz, -1.5, 1.5)
				}, true);
			}
			setDragging(null);
		};
		const onKey = (e) => {
			shift.current = e.shiftKey;
		};
		window.addEventListener("pointerup", onUp);
		window.addEventListener("pointercancel", onUp);
		window.addEventListener("keydown", onKey);
		window.addEventListener("keyup", onKey);
		return () => {
			window.removeEventListener("pointerup", onUp);
			window.removeEventListener("pointercancel", onUp);
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("keyup", onKey);
		};
	}, [registry, setDragging]);
	useFrame(() => {
		if (!draggingId) return;
		const rb = registry.get(draggingId);
		if (!rb) return;
		setBodyTypeSafe(rb, 2);
		const rect = gl.domElement.getBoundingClientRect();
		const ev = latestPointer;
		pointer.x = (ev.x - rect.left) / rect.width * 2 - 1;
		pointer.y = -((ev.y - rect.top) / rect.height) * 2 + 1;
		raycaster.setFromCamera(pointer, camera);
		if (shift.current) {
			camera.getWorldDirection(camDir);
			camDir.y = 0;
			camDir.normalize();
			planeN.crossVectors(camDir, new Vector3(0, 1, 0)).normalize();
			const t = rb.translation();
			plane.setFromNormalAndCoplanarPoint(planeN, new Vector3(t.x, t.y, t.z));
		} else plane.set(new Vector3(0, 1, 0), -dragPlaneY);
		if (!raycaster.ray.intersectPlane(plane, hit)) return;
		const next = {
			x: hit.x + dragOffset.x,
			y: shift.current ? hit.y + dragOffset.y : dragPlaneY + dragOffset.y,
			z: hit.z + dragOffset.z
		};
		next.x = MathUtils.clamp(next.x, -.7, .7);
		next.y = MathUtils.clamp(next.y, .02, .55);
		next.z = MathUtils.clamp(next.z, -.46, .46);
		last.current.set(rb.translation().x, rb.translation().y, rb.translation().z);
		lastT.current = performance.now();
		rb.setNextKinematicTranslation(next);
	});
	return null;
}
function setBodyTypeSafe(rb, type) {
	const typed = rb;
	if (typeof typed.setBodyType === "function") typed.setBodyType(type, true);
}
var latestPointer = {
	x: 0,
	y: 0
};
if (typeof window !== "undefined") window.addEventListener("pointermove", (e) => {
	latestPointer.x = e.clientX;
	latestPointer.y = e.clientY;
}, { passive: true });
function isTyping(e) {
	const t = e.target;
	if (!t) return false;
	const tag = t.tagName;
	return tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable;
}
/** Full client lab — canvas + overlay. Used when dynamically imported as a whole. */
function Playground() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay, {})]
	});
}
/** Canvas only — overlay can mount from the route for first paint. */
function Scene() {
	const registry = (0, import_react.useMemo)(() => /* @__PURE__ */ new Map(), []);
	const select = useSim((s) => s.select);
	const loadPreset = useSim((s) => s.loadPreset);
	const togglePaused = useSim((s) => s.togglePaused);
	const remove = useSim((s) => s.remove);
	const spawn = useSim((s) => s.spawn);
	const setShowField = useSim((s) => s.setShowField);
	const setIntro = useSim((s) => s.setIntro);
	const isMobile = typeof window !== "undefined" && window.innerWidth < 720;
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const t = e.target;
			if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
			if (e.code === "Space") {
				e.preventDefault();
				togglePaused();
			} else if (e.code === "KeyF") setShowField(!useSim.getState().showField);
			else if (e.code === "Escape") {
				if (useSim.getState().intro) setIntro(false);
				else select(null);
			} else if (e.code === "Delete" || e.code === "Backspace") {
				const id = useSim.getState().selectedId;
				if (id) remove(id);
			} else if (e.code === "KeyR" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				loadPreset("bench");
			} else if (e.code === "Digit1") spawn("n52-bar");
			else if (e.code === "Digit2") spawn("n52-disc");
			else if (e.code === "Digit3") spawn("electromagnet");
			else if (e.code === "Digit4") spawn("copper-plate");
			else if (e.code === "Digit5") spawn("copper-tube");
			else if (e.code === "Digit6") spawn("iron-block");
			else if (e.code === "Digit7") spawn("mercury-drop");
			else if (e.code === "Digit8") spawn("mercury-pool");
			else if (e.code === "Digit9") spawn("steel-ball");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		loadPreset,
		remove,
		select,
		setIntro,
		setShowField,
		spawn,
		togglePaused
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegistryContext.Provider, {
		value: registry,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
				shadows: false,
				dpr: isMobile ? [1, 1] : [1, 1.15],
				camera: {
					position: [
						.52,
						.38,
						.58
					],
					fov: 40,
					near: .02,
					far: 20
				},
				gl: {
					antialias: !isMobile,
					alpha: false,
					powerPreference: "default",
					failIfMajorPerformanceCaveat: false,
					stencil: false,
					depth: true
				},
				style: {
					touchAction: "none",
					position: "absolute",
					inset: 0,
					zIndex: 0
				},
				onCreated: ({ gl }) => {
					const el = gl.domElement;
					const onLost = (e) => e.preventDefault();
					el.addEventListener("webglcontextlost", onLost, false);
				},
				onPointerMissed: () => {
					if (!useSim.getState().draggingId) select(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {})
			})
		})
	});
}
//#endregion
export { Playground, Scene };
