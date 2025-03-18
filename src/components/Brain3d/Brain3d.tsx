import React, {HTMLAttributes, Suspense, useEffect, useState} from "react"
import classNames from "classnames/bind"
import {Canvas} from "@react-three/fiber"
import {useGLTF, OrbitControls, Environment} from "@react-three/drei"

// const model3D = "../../../public/brain_hologram/scene.gltf"

import {SectionContainer} from "../SectionContainer"
import styles from "./Brain.module.scss"

let cx = classNames.bind(styles)

type Brain3dProps = {
	className?: string
} & HTMLAttributes<HTMLDivElement>

function Model() {
	const {scene} = useGLTF("/brain_hologram/scene.gltf")
	return (
		<primitive
			object={scene}
			scale={3}
			position={[0, 0, 0]}></primitive>
	)
}

const Brain3d = ({className}: Brain3dProps) => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	if (!mounted) return null

	return (
		<SectionContainer size="lg">
			<div className={cx("model-wrapper", className)}>
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
						<spotLight
							position={[10, 10, 10]}
							angle={0.15}
							penumbra={1}
						/>
					</Suspense>
				</Canvas>
			</div>
		</SectionContainer>
	)
}

export {Brain3d, type Brain3dProps}
