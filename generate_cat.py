import math

vertices = [
    # Center line (x=0)
    [0.0, 1.0, 0.5], # 0: Top head
    [0.0, 0.5, 1.0], # 1: Brow
    [0.0, 0.0, 1.2], # 2: Nose bridge
    [0.0, -0.4, 1.3],# 3: Nose tip
    [0.0, -0.7, 1.1],# 4: Mouth
    [0.0, -1.0, 0.8],# 5: Chin
    [0.0, -1.2, 0.0],# 6: Neck bottom front
    [0.0, 0.8, -1.0],# 7: Back top head
    [0.0, 0.0, -1.2],# 8: Back mid head
    [0.0, -1.0, -1.0],# 9: Neck bottom back
    
    # Right side (x > 0)
    [0.4, 0.9, 0.6], # 10: Top head right
    [0.8, 1.6, 0.2], # 11: Ear tip right
    [0.9, 0.8, -0.2],# 12: Ear base back right
    [1.0, 0.5, 0.5], # 13: Cheek top right
    [1.2, 0.0, 0.4], # 14: Cheek mid right
    [1.0, -0.5, 0.6],# 15: Cheek bottom right
    [0.5, 0.4, 0.9], # 16: Eye outer right
    [0.2, 0.5, 0.9], # 17: Eye inner right
    [0.3, -0.3, 1.1],# 18: Snout side right
    [0.4, -0.8, 0.8],# 19: Jaw right
    [0.6, -1.1, 0.0],# 20: Neck side right
    [0.5, 0.0, -1.0],# 21: Back head right
]

# Generate left side by mirroring right side
num_center = 10
num_right = 12
for i in range(num_center, num_center + num_right):
    v = vertices[i]
    vertices.append([-v[0], v[1], v[2]])

# Faces (triangles, 1-indexed)
faces = [
    # Right side
    [0, 10, 1], [1, 10, 17], [10, 16, 17], [10, 13, 16],
    [10, 11, 13], [10, 7, 11], [11, 12, 13], [11, 7, 12],
    [7, 21, 12], [7, 8, 21], [8, 9, 21], [9, 20, 21],
    [21, 14, 12], [21, 20, 14], [12, 13, 14], [13, 15, 14],
    [13, 16, 15], [16, 18, 15], [16, 17, 18], [1, 17, 2],
    [17, 18, 2], [2, 18, 3], [3, 18, 19], [3, 19, 4],
    [4, 19, 5], [5, 19, 19], [5, 19, 6], [6, 19, 20],
    [6, 20, 9], [15, 19, 20], [15, 18, 19],
]

# Generate left side faces by mirroring and reversing winding order
offset = num_right
left_faces = []
for f in faces:
    lf = []
    for idx in reversed(f):
        if idx < num_center:
            lf.append(idx)
        else:
            lf.append(idx + offset)
    left_faces.append(lf)

all_faces = faces + left_faces

# Write to OBJ
with open("public/cat.obj", "w") as f:
    for v in vertices:
        f.write(f"v {v[0]} {v[1]} {v[2]}\n")
    for face in all_faces:
        f.write(f"f {face[0]+1} {face[1]+1} {face[2]+1}\n")

print("Generated public/cat.obj")
