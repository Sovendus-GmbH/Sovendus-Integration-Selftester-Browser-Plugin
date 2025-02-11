import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";
import type {
  ConversionsType,
  SovConsumerType,
} from "sovendus-integration-types";

export function ThankyouPageForm({
  config,
  setConfig,
}: {
  config: {
    iframes: ConversionsType;
    consumer: SovConsumerType;
  };
  setConfig: Dispatch<
    SetStateAction<{
      iframes: ConversionsType;
      consumer: SovConsumerType;
    }>
  >;
}): JSX.Element {
  const handleIframeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setConfig((prevData) => ({
      ...prevData,
      iframes: { ...prevData.iframes, [name]: value },
    }));
  };

  const handleConsumerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = e.target;
    setConfig((prevData) => ({
      ...prevData,
      consumer: { ...prevData.consumer, [name]: value },
    }));
  };
  return (
    <form>
      <h3>Iframe Data</h3>
      {Object.keys(config.iframes).map((key) => {
        const value = config.iframes[key as keyof typeof config.iframes];
        return (
          <div key={key}>
            <label>
              {key}:
              <input
                type="text"
                name={key}
                value={value as string | undefined}
                onChange={handleIframeChange}
              />
            </label>
          </div>
        );
      })}
      <h3>Consumer Data</h3>
      {Object.keys(config.consumer).map((key) => (
        <div key={key}>
          <label>
            {key}:
            <input
              type="text"
              name={key}
              value={
                config.consumer[key as keyof typeof config.consumer] as
                  | string
                  | undefined
              }
              onChange={handleConsumerChange}
            />
          </label>
        </div>
      ))}
    </form>
  );
}
