import { ArrowLeft, ArrowRight, Check, ExternalLink } from "lucide-react";
import React, { useCallback } from "react";

import { Alert } from "../components/alert";
import { Button } from "../components/button";
import { ErrorBoundary } from "../components/error-boundary";
import { H1 } from "../components/typography";
import { colors } from "../styles";
import { testingFlowConfig } from "../testing-flow-config";
import type { SovendusProductKey } from "../testing-storage";
import { sovendusProductKeys, type StepProps } from "../testing-storage";

interface Product {
  name: string;
  description: string;
  link: string;
  isDetected: boolean;
  key: SovendusProductKey;
}

const products: Product[] = [
  {
    key: sovendusProductKeys.VOUCHER_NETWORK,
    name: "Voucher Network",
    description: "Offers vouchers and deals to customers during checkout",
    link: "https://www.sovendus.com/en/voucher-network/",
    isDetected: false,
  },
  {
    key: sovendusProductKeys.CHECKOUT_BENEFITS,
    name: "Checkout Benefits",
    description: "Provides additional benefits and offers at checkout",
    link: "https://www.sovendus.com/en/checkout-benefits/",
    isDetected: false,
  },
  {
    key: sovendusProductKeys.OPTIMIZE,
    name: "Optimize",
    description: "Optimizes the checkout process for better conversion",
    link: "https://www.sovendus.com/en/optimize/",
    isDetected: false,
  },
  {
    key: sovendusProductKeys.CHECKOUT_PRODUCTS,
    name: "Checkout Products",
    description: "Offers relevant products to customers during checkout",
    link: "https://www.sovendus.com/en/checkout-products/",
    isDetected: false,
  },
];
export function ProductSelection({
  overlayState: { getCurrentTestRun, transition, setCurrentTestRunData },
}: StepProps): React.ReactElement {
  const currentTestRun = getCurrentTestRun();

  const toggleProduct = useCallback(
    (productName: SovendusProductKey) => {
      setCurrentTestRunData((currentRun) => {
        const updated = currentRun.selectedProducts.includes(productName)
          ? currentRun.selectedProducts.filter((p) => p !== productName)
          : [...currentRun.selectedProducts, productName];
        return {
          ...currentRun,
          selectedProducts: updated,
        };
      });
    },
    [setCurrentTestRunData],
  );

  const handleContinue = useCallback(() => {
    if (currentTestRun.selectedProducts.length > 0) {
      transition(
        testingFlowConfig.stages.productSelection.transitions.CONTINUE,
      );
    }
  }, [currentTestRun.selectedProducts]);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    color: "white",
    margin: "auto",
    maxWidth: "580px",
    overflowY: "auto",
  };

  const productsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
    marginBottom: "0.75rem",
    maxHeight: "420px",
    overflowY: "auto",
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "0.5rem",
  };
  const canContinue = currentTestRun.selectedProducts.length > 0;
  return (
    <ErrorBoundary>
      <div style={containerStyle}>
        <div>
          <H1 overlaySize={currentTestRun.overlaySize}>
            Select Sovendus Products to Test
          </H1>
          <Alert level="info">
            Select one or more products to test. You can test multiple products
            simultaneously.
          </Alert>
          <div style={productsContainerStyle}>
            {products.map((product) => (
              <ErrorBoundary key={product.name}>
                <ProductOption
                  product={product}
                  isSelected={currentTestRun.selectedProducts.includes(
                    product.key,
                  )}
                  onToggle={toggleProduct}
                />
              </ErrorBoundary>
            ))}
          </div>
          <div style={buttonContainerStyle}>
            <Button
              onClick={() =>
                transition(
                  testingFlowConfig.stages.productSelection.transitions.BACK,
                )
              }
              variant="secondary"
            >
              <ArrowLeft size={14} style={{ marginRight: "0.25rem" }} />
              Back
            </Button>
            <Button
              onClick={handleContinue}
              variant={canContinue ? "primary" : "disabled"}
            >
              Continue
              <ArrowRight size={14} style={{ marginLeft: "0.25rem" }} />
            </Button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

interface ProductOptionProps {
  product: Product;
  isSelected: boolean;
  onToggle: (productName: SovendusProductKey) => void;
}

function ProductOption({
  product,
  isSelected,
  onToggle,
}: ProductOptionProps): React.ReactElement {
  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "0.75rem",
    backgroundColor: isSelected
      ? "rgba(255, 255, 255, 0.3)"
      : "rgba(255, 255, 255, 0.1)",
    borderRadius: "0.5rem",
    border: isSelected ? "2px solid #4CAF50" : "2px solid transparent",
    cursor: product.isDetected ? "default" : "pointer",
    fontSize: "1rem",
  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: "600",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    color: colors.textLight,
  };

  return (
    <Button
      onClick={() => onToggle(product.key)}
      style={buttonStyle}
      variant={isSelected ? "primary" : "transparent"}
    >
      <div style={contentStyle}>
        <div style={titleStyle}>
          {isSelected && (
            <Check
              size={16}
              style={{ marginRight: "0.25rem", color: "#4CAF50" }}
            />
          )}
          {product.name}
          {product.isDetected && " (Detected)"}
        </div>
        <div style={descriptionStyle}>{product.description}</div>
      </div>
      <Button
        onClick={() => window.open(product.link, "_blank")}
        style={{
          marginLeft: "0.25rem",
          color: colors.textLight,
          display: "flex",
          gap: "5px",
        }}
      >
        <ExternalLink size={14} /> Info
      </Button>
    </Button>
  );
}
