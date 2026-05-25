import json
import math
import os
import struct


OUT_DIR = os.path.join(os.getcwd(), "models", "plant-cell")


def align4(data, pad_byte=b"\x00"):
    pad = (-len(data)) % 4
    return data + (pad_byte * pad)


def mat4_mul_vec(m, p):
    x, y, z = p
    return (
        m[0] * x + m[4] * y + m[8] * z + m[12],
        m[1] * x + m[5] * y + m[9] * z + m[13],
        m[2] * x + m[6] * y + m[10] * z + m[14],
    )


def transform_vertices(vertices, matrix):
    return [mat4_mul_vec(matrix, v) for v in vertices]


def translation(x, y, z):
    return (
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1,
    )


def sphere(rx=1, ry=1, rz=1, lat=24, lon=32):
    vertices = []
    normals = []
    indices = []
    for i in range(lat + 1):
        theta = math.pi * i / lat
        st = math.sin(theta)
        ct = math.cos(theta)
        for j in range(lon + 1):
            phi = 2 * math.pi * j / lon
            sp = math.sin(phi)
            cp = math.cos(phi)
            nx, ny, nz = st * cp, ct, st * sp
            vertices.append((rx * nx, ry * ny, rz * nz))
            normals.append((nx, ny, nz))
    for i in range(lat):
        for j in range(lon):
            a = i * (lon + 1) + j
            b = a + lon + 1
            indices.extend((a, b, a + 1, b, b + 1, a + 1))
    return vertices, normals, indices


def torus(major=1.0, minor=0.15, seg=48, tube=12, scale=(1, 1, 1)):
    sx, sy, sz = scale
    vertices = []
    normals = []
    indices = []
    for i in range(seg + 1):
        u = 2 * math.pi * i / seg
        cu, su = math.cos(u), math.sin(u)
        for j in range(tube + 1):
            v = 2 * math.pi * j / tube
            cv, sv = math.cos(v), math.sin(v)
            x = (major + minor * cv) * cu
            y = minor * sv
            z = (major + minor * cv) * su
            vertices.append((x * sx, y * sy, z * sz))
            normals.append((cv * cu, sv, cv * su))
    for i in range(seg):
        for j in range(tube):
            a = i * (tube + 1) + j
            b = a + tube + 1
            indices.extend((a, b, a + 1, b, b + 1, a + 1))
    return vertices, normals, indices


def cylinder(radius=1, height=1, seg=32, scale=(1, 1, 1)):
    sx, sy, sz = scale
    vertices = []
    normals = []
    indices = []
    for z_i, y in enumerate((-height / 2, height / 2)):
        for i in range(seg):
            u = 2 * math.pi * i / seg
            x, z = math.cos(u) * radius, math.sin(u) * radius
            vertices.append((x * sx, y * sy, z * sz))
            normals.append((math.cos(u), 0, math.sin(u)))
    for i in range(seg):
        a = i
        b = (i + 1) % seg
        c = seg + i
        d = seg + ((i + 1) % seg)
        indices.extend((a, c, b, b, c, d))
    return vertices, normals, indices


def merge(parts):
    vertices, normals, indices = [], [], []
    for part_vertices, part_normals, part_indices in parts:
        offset = len(vertices)
        vertices.extend(part_vertices)
        normals.extend(part_normals)
        indices.extend([idx + offset for idx in part_indices])
    return vertices, normals, indices


def write_glb(path, primitives):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    buffer = b""
    accessors = []
    buffer_views = []
    meshes = []
    materials = []

    for primitive in primitives:
        name, color, alpha, vertices, normals, indices = primitive
        material_index = len(materials)
        materials.append({
            "name": name + " material",
            "pbrMetallicRoughness": {
                "baseColorFactor": color,
                "metallicFactor": 0,
                "roughnessFactor": 0.65,
            },
            "alphaMode": "BLEND" if alpha < 1 else "OPAQUE",
            "doubleSided": True,
        })

        pos_bytes = b"".join(struct.pack("<3f", *v) for v in vertices)
        norm_bytes = b"".join(struct.pack("<3f", *n) for n in normals)
        idx_component = 5123 if len(vertices) < 65535 else 5125
        idx_fmt = "<H" if idx_component == 5123 else "<I"
        idx_bytes = b"".join(struct.pack(idx_fmt, i) for i in indices)

        def add_view(raw, target):
            nonlocal buffer
            offset = len(buffer)
            buffer += align4(raw)
            view_index = len(buffer_views)
            buffer_views.append({
                "buffer": 0,
                "byteOffset": offset,
                "byteLength": len(raw),
                "target": target,
            })
            return view_index

        pos_view = add_view(pos_bytes, 34962)
        norm_view = add_view(norm_bytes, 34962)
        idx_view = add_view(idx_bytes, 34963)

        mins = [min(v[i] for v in vertices) for i in range(3)]
        maxs = [max(v[i] for v in vertices) for i in range(3)]

        pos_accessor = len(accessors)
        accessors.append({
            "bufferView": pos_view,
            "componentType": 5126,
            "count": len(vertices),
            "type": "VEC3",
            "min": mins,
            "max": maxs,
        })
        norm_accessor = len(accessors)
        accessors.append({
            "bufferView": norm_view,
            "componentType": 5126,
            "count": len(normals),
            "type": "VEC3",
        })
        idx_accessor = len(accessors)
        accessors.append({
            "bufferView": idx_view,
            "componentType": idx_component,
            "count": len(indices),
            "type": "SCALAR",
        })

        meshes.append({
            "name": name,
            "primitives": [{
                "attributes": {"POSITION": pos_accessor, "NORMAL": norm_accessor},
                "indices": idx_accessor,
                "material": material_index,
            }],
        })

    nodes = [{"mesh": i, "name": meshes[i]["name"]} for i in range(len(meshes))]
    gltf = {
        "asset": {"version": "2.0", "generator": "plant-cell-organelle-generator"},
        "scene": 0,
        "scenes": [{"nodes": list(range(len(nodes)))}],
        "nodes": nodes,
        "meshes": meshes,
        "materials": materials,
        "buffers": [{"byteLength": len(buffer)}],
        "bufferViews": buffer_views,
        "accessors": accessors,
    }

    json_chunk = align4(json.dumps(gltf, separators=(",", ":")).encode("utf-8"), b" ")
    bin_chunk = align4(buffer)
    total_len = 12 + 8 + len(json_chunk) + 8 + len(bin_chunk)
    with open(path, "wb") as f:
        f.write(struct.pack("<4sII", b"glTF", 2, total_len))
        f.write(struct.pack("<I4s", len(json_chunk), b"JSON"))
        f.write(json_chunk)
        f.write(struct.pack("<I4s", len(bin_chunk), b"BIN\x00"))
        f.write(bin_chunk)


def primitive(name, color, alpha, shape):
    return (name, color, alpha, *shape)


def build():
    green = [0.13, 0.75, 0.42, 0.34]
    membrane = [0.1, 0.82, 0.66, 0.28]
    purple = [0.55, 0.36, 0.95, 1.0]
    magenta = [0.9, 0.45, 0.82, 1.0]
    blue = [0.26, 0.58, 1.0, 0.95]
    cyan = [0.0, 0.78, 0.75, 1.0]
    orange = [1.0, 0.45, 0.16, 1.0]
    yellow = [1.0, 0.74, 0.25, 1.0]
    red = [0.95, 0.23, 0.18, 1.0]
    lime = [0.45, 0.9, 0.24, 1.0]

    files = {
        "cell-wall.glb": [primitive("Cell Wall", green, green[3], sphere(2.25, 1.45, 1.6, 24, 36))],
        "cell-membrane.glb": [primitive("Cell Membrane", membrane, membrane[3], sphere(2.05, 1.28, 1.42, 24, 36))],
        "vacuole.glb": [primitive("Central Vacuole", blue, blue[3], sphere(1.15, 0.72, 0.88, 24, 32))],
        "nucleus.glb": [
            primitive("Nucleus", purple, purple[3], sphere(0.55, 0.55, 0.55, 24, 32)),
            primitive("Nucleolus", magenta, magenta[3], transform_shape(sphere(0.18, 0.18, 0.18, 16, 24), translation(0.16, 0.08, 0.12))),
        ],
        "nucleolus.glb": [primitive("Nucleolus", magenta, magenta[3], sphere(0.22, 0.22, 0.22, 18, 24))],
        "chloroplast.glb": [
            primitive("Chloroplast Shell", lime, lime[3], sphere(0.55, 0.22, 0.3, 18, 28)),
            primitive("Thylakoid Stacks", [0.1, 0.48, 0.14, 1.0], 1, merge([
                transform_shape(cylinder(0.16, 0.045, 24, (1.0, 1.0, 0.62)), translation(-0.22 + i * 0.11, 0, 0))
                for i in range(5)
            ])),
        ],
        "mitochondrion.glb": [
            primitive("Mitochondrion Outer Membrane", orange, orange[3], sphere(0.62, 0.28, 0.34, 20, 32)),
            primitive("Cristae Folds", yellow, yellow[3], merge([
                transform_shape(torus(0.19, 0.018, 32, 8, (1.0, 0.55, 0.35)), translation(-0.24 + i * 0.16, 0, 0))
                for i in range(4)
            ])),
        ],
        "golgi-apparatus.glb": [primitive("Golgi Apparatus", yellow, yellow[3], merge([
            transform_shape(torus(0.42 + i * 0.02, 0.035, 48, 8, (1.35, 0.18, 0.42)), translation(0, -0.16 + i * 0.08, 0))
            for i in range(5)
        ]))],
        "rough-er.glb": [
            primitive("Rough Endoplasmic Reticulum", cyan, cyan[3], merge([
                transform_shape(torus(0.55 + i * 0.08, 0.025, 48, 8, (1.25, 0.18, 0.7)), translation(0, -0.16 + i * 0.08, 0))
                for i in range(5)
            ])),
            primitive("Ribosomes", red, red[3], merge([
                transform_shape(sphere(0.045, 0.045, 0.045, 8, 12), translation(math.cos(i) * 0.7, -0.18 + (i % 5) * 0.08, math.sin(i * 1.7) * 0.35))
                for i in range(32)
            ])),
        ],
        "smooth-er.glb": [primitive("Smooth Endoplasmic Reticulum", [0.0, 0.66, 0.92, 1.0], 1, merge([
            transform_shape(torus(0.42 + i * 0.13, 0.026, 48, 8, (1.25, 0.16, 0.5)), translation(0, -0.1 + i * 0.06, 0))
            for i in range(5)
        ]))],
        "peroxisome.glb": [primitive("Peroxisome", [0.98, 0.82, 0.12, 1.0], 1, sphere(0.24, 0.24, 0.24, 18, 24))],
        "ribosome.glb": [primitive("Ribosome", red, red[3], sphere(0.08, 0.08, 0.08, 12, 16))],
    }

    for filename, primitives in files.items():
        write_glb(os.path.join(OUT_DIR, filename), primitives)

    print(f"Wrote {len(files)} GLB files to {OUT_DIR}")


def transform_shape(shape, matrix):
    vertices, normals, indices = shape
    return transform_vertices(vertices, matrix), normals, indices


if __name__ == "__main__":
    build()
