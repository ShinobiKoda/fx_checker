import Header from "@/components/Header";
import LiveMarkets from "@/components/LiveMarkets";
import Converter from "@/components/converter/Converter";
import TabsContainer from "@/components/tabs/TabsContainer";

function page() {
  return (
    <div className="bg-neutral-900 flex-1">
      <Header />
      <LiveMarkets />
      <Converter />
      <TabsContainer />
    </div>
  );
}

export default page;
