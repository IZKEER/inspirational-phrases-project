import {HeroParallax} from "@/components/ParallaxHero/ParallaxHero"
import {VelocityTextScroll} from "@/components/VelocityTextScroll"
import {ReactLenis} from "@studio-freight/react-lenis"

import {Hero, Logo, About, Contact, HorizontalScroll} from "@components"
import dynamic from "next/dynamic"

const Brain3d = dynamic(() => import("@components").then((mod) => mod.Brain3d), {
	ssr: false,
	loading: () => <div>Loading 3D Model...</div>,
})

export default function Home() {
	return (
		<>
			<ReactLenis
				root
				options={{
					lerp: 0.05,
				}}>
				<HeroParallax />
				{/* <div style={{height: "100vh"}}>
					<Brain3d />
				</div> */}
				{/* <HorizontalScroll>
					<About
						style={{background: "red"}}
						title="one one one one one one one one "
						text="about me"
					/>
					<About
						style={{background: "red"}}
						title="TWO TWO TWO TWO TWO TWO TWO "
						text="about me"
					/>

					<About
						style={{background: "red"}}
						title="TWO TWO TWO TWO TWO TWO TWO "
						text="about me"
					/>
				</HorizontalScroll> */}
				<Contact
					title={"Hey there Marcelo 👋, "}
					// reversed={true}
					// avatarImg={""}
					// avatarName={"Marcelo Santos"}
					// avatarCareer={"Frontend Developer"}
					contactLink={"https://www.linkedin.com/in/marcelo-santos-3b6b1b1b1/"}
				/>
			</ReactLenis>
		</>
	)
}
