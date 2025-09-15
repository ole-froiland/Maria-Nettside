import React from 'react';

type Experience = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

const EXPERIENCES: Experience[] = [
  {
    role: 'Salgsmedarbeider',
    company: 'Peppes Pizza',
    period: '2021–2022',
    bullets: ['Kundeservice og bestillinger', 'Fokus på mersalg'],
  },
  {
    role: 'Salgsleder',
    company: 'Peppes Pizza',
    period: '2022–2024',
    bullets: ['Ledet 8–10 personer', 'Bemanning og opplæring', 'Rapportering'],
  },
  {
    role: 'Regnskapskonsulent',
    company: 'Azets',
    period: '2024–d.d.',
    bullets: ['Bokføring', 'Rapportering og controlling', 'Kundeoppfølging'],
  },
];

const ExperienceSection: React.FC = () => {
  return (
    <section
      aria-label="Erfaring"
      className="mx-auto max-w-[700px] px-4 md:px-6 py-6 md:py-10"
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Erfaring
      </h2>

      <div className="mt-6 space-y-4">
        {EXPERIENCES.map((item, idx) => {
          const headingId = `experience-${idx}`;
          return (
            <article
              key={headingId}
              aria-labelledby={headingId}
              tabIndex={0}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm p-6 space-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 transition-shadow hover:shadow-md focus:shadow-md motion-reduce:transition-none"
            >
              <header className="flex items-baseline justify-between gap-3">
                <h3 id={headingId} className="text-base md:text-lg">
                  <span className="font-semibold">{item.role}</span>
                  <span className="mx-1.5 text-slate-400 dark:text-slate-500">—</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {item.company}
                  </span>
                </h3>
                <time
                  aria-label={`Periode ${item.period}`}
                  className="shrink-0 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] md:text-xs px-2 py-1"
                >
                  {item.period}
                </time>
              </header>

              <ul className="list-disc pl-5 space-y-1 text-[0.95rem] text-slate-700 dark:text-slate-300">
                {item.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceSection;
