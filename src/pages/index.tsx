import {QuoteCard} from '@/components/QuoteCard';
import {SectionContainer} from '@/components/SectionContainer';
import {ReactLenis} from '@studio-freight/react-lenis';

import dynamic from 'next/dynamic';

const Brain3d = dynamic(() => import('@components').then((mod) => mod.Brain3d), {
	ssr: false,
	loading: () => <div>Loading 3D Model...</div>,
});

export default function Home() {
	return (
		<>
			<SectionContainer size="fluid">
				<QuoteCard
					title="You can."
					content="Unbothered. Moisturized. Happy. In your attic. I have a gun. Focused."
					author="Caruma"
				/>
			</SectionContainer>
		</>
	);
}
