import React, {HTMLAttributes, Suspense, useEffect, useState} from 'react';
import classNames from 'classnames/bind';
import {Canvas} from '@react-three/fiber';
import {useGLTF, OrbitControls, Environment} from '@react-three/drei';

import {SectionContainer} from '../SectionContainer';
import styles from './Brain.module.scss';

let cx = classNames.bind(styles);

type Brain3dProps = {
	className?: string;
	width?: number;
	height?: number;
} & HTMLAttributes<HTMLDivElement>;

function Model() {
	// Add the repository name to the path
	const {scene} = useGLTF('/inspirational-phrases-project/brain_hologram/scene.gltf');
	return <primitive object={scene} scale={3} position={[0, 0, 0]}></primitive>;
}

const Brain3d = ({className, width = 500, height = 300}: Brain3dProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!mounted) return null;

	return (
		<div
			className={cx('model-wrapper', className)}
			style={{
				width: '100%',
				maxWidth: `${width}px`,
				height: `${height}px`,
				margin: '0 auto', // Center the canvas
			}}>
			<Canvas>
				<Suspense fallback={null}>
					<Environment preset="studio" />
					<Model />
					<OrbitControls
						autoRotate={true}
						autoRotateSpeed={0.5}
						enableZoom={false}
						minPolarAngle={Math.PI / 2}
						minAzimuthAngle={-Math.PI / 4}
						maxPolarAngle={Math.PI / 2}
					/>
					<ambientLight intensity={0.5} />
					<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
				</Suspense>
			</Canvas>
		</div>
	);
};

export {Brain3d, type Brain3dProps};
