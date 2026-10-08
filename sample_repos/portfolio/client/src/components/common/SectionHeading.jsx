/**
 * SectionHeading Component
 * 
 * Reusable portfolio section heading with dual-layer watermark and foreground title.
 * 
 * @param {Object} props
 * @param {string} [props.watermark="PORTFOLIO"] - Faint background watermark text (e.g. "PORTFOLIO", "SKILLS")
 * @param {string} props.title - Main section title (e.g. "SELECTED WORK", "TECHNICAL EXPERTISE")
 * @param {'bnw'|'color'|'colorful'} [props.variant="color"] - Visual theme:
 *    - 'bnw': Crisp monochrome (neutral watermark, dark gray/black slash)
 *    - 'color' | 'colorful': Signature shirt-matching teal accent on the slash (/), soft cyan-tinted watermark
 * @param {'center'|'left'|'right'} [props.align="center"] - Horizontal text & watermark alignment
 * @param {string} [props.subtitle=""] - Optional supporting tagline/description
 * @param {string} [props.className=""] - Additional wrapper styling
 * @param {string} [props.as="h2"] - Heading tag ('h1', 'h2', 'h3'), defaults to 'h2'
 */
export default function SectionHeading({
  watermark = 'PORTFOLIO',
  title = 'SELECTED WORK',
  variant = 'color',
  align = 'center',
  subtitle = '',
  className = '',
  as: Component = 'h2'
}) {
  const isColor = variant === 'color' || variant === 'colorful';

  // Alignment configuration for container and positioning
  const alignStyles = {
    center: {
      wrapper: 'justify-center items-center text-center',
      watermark: 'left-1/2 -translate-x-1/2',
      content: 'items-center text-center',
      subtitle: 'mx-auto text-center'
    },
    left: {
      wrapper: 'justify-start items-start text-left',
      watermark: 'left-0 sm:-translate-x-3',
      content: 'items-start text-left',
      subtitle: 'text-left'
    },
    right: {
      wrapper: 'justify-end items-end text-right',
      watermark: 'right-0 sm:translate-x-3',
      content: 'items-end text-right',
      subtitle: 'ml-auto text-right'
    }
  };

  const currentAlign = alignStyles[align] || alignStyles.center;

  // Theme variant styles: colored by default with signature teal accents
  const themeStyles = {
    color: {
      slash: 'text-[#367C8E]',
      watermark: 'text-[#E8F4F7]',
      title: 'text-zinc-950',
      subtitle: 'text-zinc-600'
    },
    bnw: {
      slash: 'text-zinc-900',
      watermark: 'text-[#F1F1EF]',
      title: 'text-zinc-950',
      subtitle: 'text-zinc-500'
    }
  };

  const currentTheme = isColor ? themeStyles.color : themeStyles.bnw;

  return (
    <div className={`relative flex flex-col mb-8 sm:mb-12 py-2 sm:py-3 select-none overflow-hidden max-w-full ${currentAlign.wrapper} ${className}`}>
      
      {/* Background Watermark */}
      {watermark && (
        <span
          className={`absolute top-1/2 -translate-y-[58%] font-display text-[clamp(2.2rem,8.5vw,7.8rem)] font-extrabold tracking-widest uppercase select-none pointer-events-none z-0 whitespace-nowrap leading-none ${currentAlign.watermark} ${currentTheme.watermark}`}
          aria-hidden="true"
        >
          {watermark}
        </span>
      )}

      {/* Foreground Heading: /TITLE */}
      <Component className={`relative z-10 font-display text-[clamp(1.5rem,5.5vw,2.75rem)] font-extrabold tracking-tight m-0 leading-tight ${currentTheme.title}`}>
        <span 
          className={`inline-block mr-1 font-bold ${currentTheme.slash}`}
          aria-hidden="true"
        >
          /
        </span>
        <span>{title}</span>
      </Component>

      {/* Optional Supporting Subtitle */}
      {subtitle && (
        <p className={`relative z-10 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed ${currentAlign.subtitle} ${currentTheme.subtitle}`}>
          {subtitle}
        </p>
      )}

    </div>
  );
}
