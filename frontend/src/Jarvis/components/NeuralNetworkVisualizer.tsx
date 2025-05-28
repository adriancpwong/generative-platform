import { forwardRef, useEffect } from "react";
import * as THREE from "three";

interface NeuralNetworkVisualizerProps {
    // Add any props you need
}

const NeuralNetworkVisualizer = forwardRef<
    HTMLCanvasElement,
    NeuralNetworkVisualizerProps
>((props, ref) => {
    useEffect(() => {
        if (!ref || typeof ref === "function" || !ref.current) return;

        const canvas = ref.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        // Create nodes and connections (simplified version)
        const nodes: THREE.Mesh[] = [];
        const connections: {
            line: THREE.Line;
            node1: THREE.Mesh;
            node2: THREE.Mesh;
        }[] = [];
        const nodeCount = 100;

        for (let i = 0; i < nodeCount; i++) {
            const geometry = new THREE.SphereGeometry(0.03, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00d4ff,
                transparent: true,
                opacity: 0.8,
            });
            const node = new THREE.Mesh(geometry, material);

            const radius = 3 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            node.position.x = radius * Math.sin(phi) * Math.cos(theta);
            node.position.y = radius * Math.sin(phi) * Math.sin(theta);
            node.position.z = radius * Math.cos(phi);

            (node as any).originalPosition = node.position.clone();
            (node as any).velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            );

            scene.add(node);
            nodes.push(node);
        }

        // Create connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].position.distanceTo(
                    nodes[j].position
                );
                if (distance < 2.5 && Math.random() > 0.7) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        nodes[i].position,
                        nodes[j].position,
                    ]);
                    const material = new THREE.LineBasicMaterial({
                        color: 0x00d4ff,
                        transparent: true,
                        opacity: 0.3,
                    });
                    const connection = new THREE.Line(geometry, material);
                    scene.add(connection);
                    connections.push({
                        line: connection,
                        node1: nodes[i],
                        node2: nodes[j],
                    });
                }
            }
        }

        camera.position.z = 8;

        const animate = () => {
            requestAnimationFrame(animate);

            // Simple rotation
            scene.rotation.x += 0.005;
            scene.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [ref]);

    return <canvas id="neuralCanvas" ref={ref} />;
});

NeuralNetworkVisualizer.displayName = "NeuralNetworkVisualizer";

export default NeuralNetworkVisualizer;
