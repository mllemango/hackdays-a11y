import { MediaCard, AppProvider } from "@shopify/polaris";

function About() {
  return (
    <AppProvider i18n={{}}>
      <MediaCard
        title="Getting Started"
        primaryAction={{
          content: "Learn about getting started",
          onAction: () => {},
        }}
        description="Discover how Shopify can power up your entrepreneurial journey."
        popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
      >
        <img
          alt=""
          width="100%"
          height="100%"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          src="https://miro.medium.com/max/4800/0*Y8EzNegFamAO5_zV."
        />
      </MediaCard>
    </AppProvider>
  );
}

export default About;
