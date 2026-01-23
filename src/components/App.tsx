import { useState, useRef } from "react";
import { useFormulaUrl } from "../hooks/useFormulaUrl";
import { useDebounce } from "../hooks/useDebounce";
import { Background } from "./Background";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FormulaInput } from "./FormulaInput";
import { FormulaRenderer, FormulaRendererRef } from "./FormulaRenderer";
import { ShareButton } from "./ShareButton";
import { DownloadRasterMenu, DownloadVectorMenu } from "./DownloadMenu";
import type { InputMode } from "./InputModeToggle";

export function App() {
  const [formula, setFormula] = useFormulaUrl();
  const [inputMode, setInputMode] = useState<InputMode>("visual");
  const formulaRef = useRef<FormulaRendererRef>(null);

  // Debounce rendering to avoid excessive re-renders while typing
  const debouncedFormula = useDebounce(formula, 150);

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#030712]">
      {/* Fixed background behind everything */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <Background />
      </div>

      {/* Content layer above background */}
      <div className="relative z-10 flex min-h-dvh flex-col">
        <Header />

        <main className="mx-auto w-full max-w-3xl flex-1 p-6">
          <div className="flex flex-col gap-6">
            <FormulaInput
              value={formula}
              onChange={setFormula}
              mode={inputMode}
              onModeChange={setInputMode}
            />

            {inputMode !== "table" && (
              <>
                <FormulaRenderer ref={formulaRef} latex={debouncedFormula} />

                <div className="flex justify-center gap-3">
                  <DownloadRasterMenu
                    formulaRef={formulaRef}
                    disabled={!formula.trim()}
                  />
                  <DownloadVectorMenu
                    formulaRef={formulaRef}
                    disabled={!formula.trim()}
                  />
                  <ShareButton disabled={!formula.trim()} />
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
