import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const NumbersShowcase = () => {
  const { t } = useTranslation();

  const numbers = [
    { num: 1, meaning: t("landing.num1"), desc: t("landing.num1Desc"), color: "from-red-500 to-orange-500" },
    { num: 2, meaning: t("landing.num2"), desc: t("landing.num2Desc"), color: "from-blue-400 to-cyan-400" },
    { num: 3, meaning: t("landing.num3"), desc: t("landing.num3Desc"), color: "from-yellow-400 to-amber-400" },
    { num: 4, meaning: t("landing.num4"), desc: t("landing.num4Desc"), color: "from-green-500 to-emerald-500" },
    { num: 5, meaning: t("landing.num5"), desc: t("landing.num5Desc"), color: "from-purple-400 to-pink-400" },
    { num: 6, meaning: t("landing.num6"), desc: t("landing.num6Desc"), color: "from-rose-400 to-pink-500" },
    { num: 7, meaning: t("landing.num7"), desc: t("landing.num7Desc"), color: "from-indigo-400 to-violet-400" },
    { num: 8, meaning: t("landing.num8"), desc: t("landing.num8Desc"), color: "from-amber-500 to-orange-500" },
    { num: 9, meaning: t("landing.num9"), desc: t("landing.num9Desc"), color: "from-teal-400 to-cyan-500" },
  ];

  const masterNumbers = [
    { num: 11, meaning: t("landing.master11"), desc: t("landing.master11Desc") },
    { num: 22, meaning: t("landing.master22"), desc: t("landing.master22Desc") },
    { num: 33, meaning: t("landing.master33"), desc: t("landing.master33Desc") },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {t("landing.numbersTitle").split("<1>")[0]}
            <span className="text-gradient-gold">{t("landing.numbersTitle").split("<1>")[1]?.split("</1>")[0]}</span>
            {t("landing.numbersTitle").split("</1>")[1] || ""}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("landing.numbersSubtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          {numbers.map((item, index) => (
            <motion.div key={item.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group">
              <div className="relative p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mx-auto mb-3`}>
                    <span className="text-2xl font-display font-bold text-white">{item.num}</span>
                  </div>
                  <h4 className="font-display text-lg font-semibold mb-1 text-foreground">{item.meaning}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
            {t("landing.masterTitle").split("<1>")[0]}
            <span className="text-gradient-gold">{t("landing.masterTitle").split("<1>")[1]?.split("</1>")[0]}</span>
            {t("landing.masterTitle").split("</1>")[1] || ""}
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("landing.masterSubtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {masterNumbers.map((item, index) => (
            <motion.div key={item.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group">
              <div className="relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="number-circle mx-auto mb-4 group-hover:pulse-gold">{item.num}</div>
                  <h4 className="font-display text-xl font-semibold mb-2 text-foreground">{item.meaning}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NumbersShowcase;
