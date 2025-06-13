import React, {HTMLAttributes, Suspense, useEffect, useState, useCallback} from 'react';
import classNames from 'classnames/bind';
import {Canvas} from '@react-three/fiber';
import {useGLTF, OrbitControls, Environment} from '@react-three/drei';

import styles from './Brain.module.scss';

let cx = classNames.bind(styles);

type Brain3dProps = {
	className?: string;
	width?: number;
	height?: number;
} & HTMLAttributes<HTMLDivElement>;

function Model() {
	try {
		const {scene} = useGLTF('/brain_hologram/scene.gltf');
		return <primitive object={scene} scale={3} position={[0, 0, 0]}></primitive>;
	} catch (error) {
		console.warn('Failed to load 3D brain model:', error);
		return null;
	}
}

// Animated CSS brain fallback
function FallbackBrain() {
	return (
		<div 
			className={cx('fallback-brain')}
			style={{
				width: '150px',
				height: '150px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(45deg, rgba(205, 99, 0, 0.1), rgba(205, 99, 0, 0.3))',
				borderRadius: '50%',
				color: '#cd6300',
				fontSize: '48px',
				margin: '0 auto',
				animation: 'pulse 2s infinite',
				cursor: 'pointer',
				transition: 'transform 0.3s ease',
			}}
			onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
			onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
		>
			🧠
		</div>
	);
}

const Brain3d = ({className, width = 500, height = 300}: Brain3dProps) => {
	const [mounted, setMounted] = useState(false);
	const [showFallback, setShowFallback] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	// Handle any 3D errors by showing fallback
	const handleError = useCallback((error: any) => {
		console.warn('3D Brain error, showing fallback:', error);
		setShowFallback(true);
	}, []);

	if (!mounted) return null;

	// Show fallback if there was an error
	if (showFallback) {
		return <FallbackBrain />;
	}

	return (
		<div
			className={cx('model-wrapper', className)}
			style={{
				width: '100%',
				maxWidth: `${width}px`,
				height: `${height}px`,
				margin: '0 auto',
			}}>
			<Canvas
				onError={handleError}
				gl={{
					antialias: true,
					alpha: true,
					powerPreference: "default",
					failIfMajorPerformanceCaveat: false,
				}}
			>
				<Suspense fallback={null}>
					<Environment preset="studio" />
					<Model />
					<OrbitControls
						autoRotate={true}
						autoRotateSpeed={0.5}
						enableZoom={false}
						enablePan={false}
						enableRotate={true}
						minPolarAngle={Math.PI / 2}
						maxPolarAngle={Math.PI / 2}
						minAzimuthAngle={-Math.PI / 4}
						maxAzimuthAngle={Math.PI / 4}
					/>
					<ambientLight intensity={0.5} />
					<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				</Suspense>
			</Canvas>
		</div>
	);
};

export {Brain3d, type Brain3dProps};
