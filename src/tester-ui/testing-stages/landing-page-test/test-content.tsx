import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { DetectionState } from "../../../detector/integration-detector";
import { OverlaySize, type StepProps } from "../../testing-storage";
import { StatusItem } from "../components/status-item";

export function LandingPageTestContent({
  overlayState,
  stageInfo,
}: StepProps): JSX.Element {
  const { getCurrentTestRun, transition, startNewTest } = overlayState;
  const currentTestRun = getCurrentTestRun();
  const currentSize = currentTestRun.overlaySize;
  const currentPageTestResult = currentTestRun.landingPageResult;

  const selectedProducts = currentTestRun.selectedProducts;

  const handleStepCompletion = (): void => {
    const completeTransition = stageInfo.transitions.COMPLETE;
    if (!completeTransition) {
      throw new Error("Transition 'COMPLETE' not found");
    }
    transition(completeTransition);
  };

  const handleStepBack = (): void => {
    const completeTransition = stageInfo.transitions.BACK;
    if (!completeTransition) {
      throw new Error("Transition 'BACK' not found");
    }
    transition(completeTransition);
  };

  const isDetected =
    currentPageTestResult.integrationDetector?.detectionState ===
    DetectionState.DETECTED;

  const renderContent = (): JSX.Element => {
    const StepIcon = stageInfo.icon!;

    switch (currentSize) {
      case OverlaySize.SMALL:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <StepIcon size={20} />
            <StatusItem
              label={stageInfo.title}
              value={"Done"}
              icon={CheckCircle}
              color={"#10B981"}
              small
            />
          </motion.div>
        );
      case OverlaySize.MEDIUM:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <StepIcon size={24} style={{ marginRight: "10px" }} />
              <h3 style={{ fontSize: "16px", margin: 0 }}>{stageInfo.title}</h3>
            </div>
            <p style={{ fontSize: "14px", marginBottom: "15px" }}>
              {stageInfo.instruction}
            </p>
            <button
              onClick={handleStepCompletion}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                backgroundColor: "#4F46E5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ marginRight: "5px" }}>Complete Step</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        );
      case OverlaySize.LARGE:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "20px" }}
          >
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <StepIcon size={32} style={{ marginRight: "15px" }} />
              Landing Page Test
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <StatusItem
                label="Integration"
                value={isDetected ? "Detected" : "Not Detected"}
                icon={isDetected ? CheckCircle : XCircle}
                color={isDetected ? "#10B981" : "#EF4444"}
              />
              <StatusItem
                label="Integration Type"
                value={
                  currentPageTestResult.integrationTester?.integrationType
                    ?.elementValue || "Unknown"
                }
                color={"#fff"}
              />
            </div>
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>
                {stageInfo.title}
              </h3>
              <p style={{ fontSize: "16px", marginBottom: "20px" }}>
                {stageInfo.instruction}
              </p>
              <button
                onClick={handleStepCompletion}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  backgroundColor: "#4F46E5",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4338CA")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4F46E5")
                }
              >
                <span style={{ marginRight: "10px" }}>Complete Step</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // backgroundColor: "#1F2937",
        // color: "#F3F4F6",
      }}
    >
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      {currentSize !== OverlaySize.SMALL && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <button
            onClick={handleStepBack}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#4B5563",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#374151")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#4B5563")
            }
          >
            <ArrowLeft size={16} style={{ marginRight: "5px" }} />
            Back
          </button>
          <button
            onClick={startNewTest}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#4B5563",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#374151")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#4B5563")
            }
          >
            <RotateCcw size={16} style={{ marginRight: "5px" }} />
            Restart Test
          </button>
        </motion.div>
      )}
    </div>
  );
}
