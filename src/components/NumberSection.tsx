import { useTranslation } from "react-i18next";
import { getNumberTemplate, getTypeSynthesis, getCalculationMethod } from "@/lib/numberTemplateDescriptions";

type NumberType = 'destino' | 'io' | 'anima' | 'personalita' | 'quintessenza' | 'ciclo';

interface NumberSectionProps {
  num: number;
  type: NumberType;
  title: string;
  subtitle?: string;
}

const NumberSection = ({ num, type, title, subtitle }: NumberSectionProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.substring(0, 2) || "it";
  const template = getNumberTemplate(num, type, lang);
  const synthesis = getTypeSynthesis(type, lang);
  const calculation = getCalculationMethod(type, lang);

  if (!template) return null;

  return (
    <section className="glass-cosmic rounded-2xl p-8 space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold flex items-center gap-3 mb-3">
          <span className="number-circle">{num}</span>
          {title}
        </h2>
        <p className="text-primary/70 italic text-sm mb-1">{synthesis}</p>
        {subtitle ? (
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        ) : (
          <p className="text-muted-foreground text-xs">{calculation}</p>
        )}
      </div>

      <div>
        <p className="font-display text-lg font-semibold text-foreground leading-relaxed">
          {template.synthesis}
        </p>
      </div>

      <div className="border-l-2 border-primary/40 pl-5 py-3 rounded-r-lg bg-card/50">
        <h4 className="font-semibold text-sm text-primary mb-2">{t("numberSection.example")}</h4>
        <p className="text-sm text-foreground/80 leading-relaxed">{template.example}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-card/50 border border-border/30">
          <h4 className="font-semibold text-sm text-primary mb-2">{t("numberSection.gifts")}</h4>
          <p className="text-sm text-foreground/80 leading-relaxed">{template.gifts}</p>
        </div>
        <div className="p-4 rounded-xl bg-card/50 border border-border/30">
          <h4 className="font-semibold text-sm text-primary mb-2">{t("numberSection.challenge")}</h4>
          <p className="text-sm text-foreground/80 leading-relaxed">{template.challenge}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <h4 className="font-semibold text-sm text-amber-400 mb-2">{t("numberSection.advice")}</h4>
        <p className="text-sm text-foreground/80 leading-relaxed">{template.advice}</p>
      </div>
    </section>
  );
};

export default NumberSection;
