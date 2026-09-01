import type { ChainLink, EvolutionChain, Pokemon, PokemonSpecies } from '../../../api/types'
import {
  capitalize,
  extractIdFromUrl,
  formatHeight,
  formatWeight,
  getEnglishFlavorText,
  getEnglishGenus,
} from '../../../utils/formatters'
import { BookIcon, EvolutionIcon, RulerIcon, SparkleIcon, TrainingIcon } from '../../ui/icons'

interface EvolutionStep {
  id: number
  name: string
  minLevel: number | null
}

// Flattened depth-first. Branching evolutions (e.g. Eevee) will list every
// branch in sequence rather than as a tree — a reasonable simplification for
// this exercise since the design only shows a single linear chain.
function flattenEvolutionChain(link: ChainLink): EvolutionStep[] {
  const steps: EvolutionStep[] = [
    {
      id: extractIdFromUrl(link.species.url),
      name: link.species.name,
      minLevel: link.evolution_details[0]?.min_level ?? null,
    },
  ]
  for (const next of link.evolves_to) {
    steps.push(...flattenEvolutionChain(next))
  }
  return steps
}

function spriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

interface AboutTabProps {
  pokemon: Pokemon
  species: PokemonSpecies | undefined
  evolutionChain: EvolutionChain | undefined
}

export function AboutTab({ pokemon, species, evolutionChain }: AboutTabProps) {
  const flavorText = species ? getEnglishFlavorText(species.flavor_text_entries) : ''
  const genus = species ? getEnglishGenus(species.genera) : ''
  const evolutionSteps = evolutionChain ? flattenEvolutionChain(evolutionChain.chain) : []

  return (
    <div className="flex flex-col gap-6">
      <section>
        <SectionHeading icon={<BookIcon />}>Pokédex Entry</SectionHeading>
        <p className="text-sm text-text">{flavorText || 'No description available.'}</p>
      </section>

      <section>
        <SectionHeading icon={<TrainingIcon />}>Training</SectionHeading>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Catch Rate" value={species ? String(species.capture_rate) : '—'} />
          <Stat
            label="Growth Rate"
            value={species ? capitalize(species.growth_rate.name) : '—'}
          />
        </div>
      </section>

      <section>
        <SectionHeading icon={<RulerIcon />}>Physical Attributes</SectionHeading>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Height" value={formatHeight(pokemon.height)} />
          <Stat label="Weight" value={formatWeight(pokemon.weight)} />
        </div>
      </section>

      {evolutionSteps.length > 1 ? (
        <section>
          <SectionHeading icon={<EvolutionIcon />}>Evolution Chain</SectionHeading>
          <div className="flex flex-wrap items-center gap-2">
            {evolutionSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                {index > 0 ? (
                  <div className="flex flex-col items-center text-text-muted">
                    <span aria-hidden="true">→</span>
                    {step.minLevel ? <span className="text-[10px]">Lv. {step.minLevel}</span> : null}
                  </div>
                ) : null}
                <div className="flex flex-col items-center gap-1">
                  <img src={spriteUrl(step.id)} alt={step.name} className="h-14 w-14 object-contain" />
                  <span className="text-xs font-medium text-text">{capitalize(step.name)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {genus ? (
        <section>
          <SectionHeading icon={<SparkleIcon />}>Classification</SectionHeading>
          <span className="inline-flex rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text">
            {genus}
          </span>
        </section>
      ) : null}
    </div>
  )
}

function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-text">
      <span className="text-brand">{icon}</span>
      {children}
    </h3>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-text-muted">{label}</dt>
      <dd className="font-medium text-text">{value}</dd>
    </div>
  )
}
