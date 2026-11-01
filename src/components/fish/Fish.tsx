import type { FC } from 'react';
import type { Species } from '../../game/fishTiers';
import type { FishProps } from './FishProps';
import { SardineFish } from './SardineFish';
import { ClownfishFish } from './ClownfishFish';
import { GrouperFish } from './GrouperFish';
import { TunaFish } from './TunaFish';
import { SharkFish } from './SharkFish';
import { WhaleSharkFish } from './WhaleSharkFish';

// Hi-detail fish set (FishSVG exports) — inline SVG components, each wrapped
// in a single whole-body .f-glide sway group (per-fin sub-grouping isn't
// practical on these path counts). Gradient ids are uniquified per instance
// via useId() inside each component, since many copies of the same species
// render simultaneously (ambient drifters, swimmers, legend icons) and SVG
// def ids must be unique per document.
const COMPONENTS: Record<Species, FC<FishProps>> = {
  sardine: SardineFish,
  clownfish: ClownfishFish,
  grouper: GrouperFish,
  tuna: TunaFish,
  shark: SharkFish,
  whaleshark: WhaleSharkFish,
};

export function Fish({ species, ...rest }: FishProps & { species: Species }) {
  const Component = COMPONENTS[species];
  return <Component {...rest} />;
}
