"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Accordion } from "radix-ui";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * An FAQ that reads as a conversation: the question is a bubble you tap, the
 * answer arrives underneath it as the reply.
 *
 * Two notes on the dependencies, because this component is normally installed
 * with three of its own:
 *
 * - `motion/react`, not `framer-motion`. `motion` is that library under its
 *   current name and is already a dependency here; installing the old name
 *   alongside it would ship both copies and give the page two animation
 *   contexts.
 * - `radix-ui`, not `@radix-ui/react-accordion`. The project uses the unified
 *   package (see button.tsx and badge.tsx), which re-exports the same
 *   primitive.
 */
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: "left" | "right";
}

interface FaqAccordionProps {
  data: FAQItem[];
  className?: string;
  timestamp?: string;
  questionClassName?: string;
  answerClassName?: string;
}

export function FaqAccordion({
  data,
  className,
  timestamp,
  questionClassName,
  answerClassName,
}: FaqAccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <div className={cn("p-4", className)}>
      {timestamp && (
        <div className="mb-4 text-sm text-muted-foreground">{timestamp}</div>
      )}

      <Accordion.Root
        type="single"
        collapsible
        value={openItem || ""}
        onValueChange={(value) => setOpenItem(value)}
      >
        {data.map((item) => {
          const isOpen = openItem === item.id.toString();

          return (
            <Accordion.Item
              value={item.id.toString()}
              key={item.id}
              className="mb-2"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-start gap-x-4 text-left">
                  <div
                    className={cn(
                      "relative flex items-center space-x-2 rounded-xl p-2 transition-colors",
                      isOpen
                        ? "bg-primary/20 text-primary"
                        : "bg-muted hover:bg-primary/10",
                      questionClassName,
                    )}
                  >
                    {item.icon && (
                      <span
                        aria-hidden
                        className={cn(
                          "absolute bottom-6",
                          item.iconPosition === "right" ? "right-0" : "left-0",
                        )}
                        style={{
                          transform:
                            item.iconPosition === "right"
                              ? "rotate(7deg)"
                              : "rotate(-4deg)",
                        }}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="font-medium">{item.question}</span>
                  </div>

                  <span
                    aria-hidden
                    className={cn(
                      "shrink-0 text-muted-foreground",
                      isOpen && "text-primary",
                    )}
                  >
                    {isOpen ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>

              {/* `forceMount` is what lets the panel animate its height open and
                  shut instead of appearing at full size — but it also means the
                  answer stays in the DOM while collapsed, where a screen reader
                  would read out every answer on the page at once. `inert` takes
                  the closed panel back out of the accessibility tree without
                  taking it out of the layout the animation needs. */}
              <Accordion.Content asChild forceMount>
                <motion.div
                  initial="collapsed"
                  animate={isOpen ? "open" : "collapsed"}
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                  inert={!isOpen}
                >
                  <div className="ml-7 mt-1 md:ml-16">
                    <div
                      className={cn(
                        "relative max-w-xs rounded-2xl bg-primary px-4 py-2 text-primary-foreground",
                        answerClassName,
                      )}
                    >
                      {item.answer}
                    </div>
                  </div>
                </motion.div>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </div>
  );
}
