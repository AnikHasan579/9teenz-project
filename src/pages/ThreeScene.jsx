import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Text, Html } from '@react-three/drei';
import { useRef, useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { getProducts } from '../services/productService';

// 🔥 Ekta 3D Product Box (Image Shoho)
function ProductModel({ product, position, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(THREE.TextureLoader, product.image);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Hover korle halka dule, na hole static
      meshRef.current.rotation.y = hovered ? Math.sin(t) * 0.2 : 0;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh 
          ref={meshRef} 
          castShadow 
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.1 : 1}
        >
          {/* 3D Card Shape */}
          <boxGeometry args={[2, 3, 0.1]} />
          <meshStandardMaterial map={texture} roughness={0.4} metalness={0.1} />
        </mesh>
      </Float>
      <Text position={[0, -1.8, 0]} fontSize={0.2} color="#fff" anchorX="center" anchorY="middle" maxWidth={2}>
        {product.name}
      </Text>
      <Text position={[0, -2.2, 0]} fontSize={0.18} color="#e94560" anchorX="center" anchorY="middle">
        ৳ {product.price}
      </Text>
    </group>
  );
}

function ThreeScene() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      // Prothom 5 ta product nibo (3D view er jonno)
      setProducts(data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1a1a2e', color: 'white' }}>Loading 3D Products...</div>;

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #e94560)', position: 'relative' }}>
      
      {/* 🔥 Header */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'white', zIndex: 10 }}>
        <h1 style={{ fontFamily: 'Garamond, serif', fontSize: '48px', margin: 0 }}>Hangtime 3D</h1>
        <p style={{ fontFamily: 'Raleway, sans-serif', opacity: 0.8 }}>Click on a product to view details</p>
      </div>

      {/* 🔥 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <spotLight position={[-5, 5, 5]} intensity={0.5} />
        
        <Environment preset="city" />

        <Suspense fallback={null}>
          {/* 🔥 3D Products Loop */}
          {products.map((product, index) => {
            // Position calculation (Pasha-pashi boshabo)
            const x = (index - (products.length - 1) / 2) * 3;
            return (
              <ProductModel 
                key={product._id} 
                product={product} 
                position={[x, 0, 0]} 
                onClick={() => navigate(`/product/${product._id}`)} 
              />
            );
          })}
        </Suspense>

        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={20} blur={2} far={5} />

        <OrbitControls enablePan={true} enableZoom={true} minDistance={5} maxDistance={20} />
      </Canvas>
    </div>
  );
}

export default ThreeScene;