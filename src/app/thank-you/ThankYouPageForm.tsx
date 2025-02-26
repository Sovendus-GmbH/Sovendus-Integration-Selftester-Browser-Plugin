import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  JSX,
  SetStateAction,
} from "react";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

export function ThankyouPageForm({
  config,
  setConfig,
}: {
  config: {
    orderData: SovendusConversionsData;
    customerData: SovendusConsumerData;
  };
  setConfig: Dispatch<
    SetStateAction<{
      orderData: SovendusConversionsData;
      customerData: SovendusConsumerData;
    }>
  >;
}): JSX.Element {
  const handleIframeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setConfig((prevData) => ({
      ...prevData,
      orderData: { ...prevData.orderData, [name]: value },
    }));
  };

  const handleConsumerChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setConfig((prevData) => ({
      ...prevData,
      customerData: { ...prevData.customerData, [name]: value },
    }));
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Stores the form configuration in localStorage
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <h3>Iframe Data</h3>
      {Object.keys(config.orderData).map((key) => {
        const value = config.orderData[key as keyof typeof config.orderData];
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
      {Object.keys(config.customerData).map((key) => (
        <div key={key}>
          <label>
            {key}:
            <input
              type="text"
              name={key}
              value={
                config.customerData[key as keyof typeof config.customerData] as
                  | string
                  | undefined
              }
              onChange={handleConsumerChange}
            />
          </label>
        </div>
      ))}
      <button type="submit">Save Form Data</button>
    </form>
  );
}
