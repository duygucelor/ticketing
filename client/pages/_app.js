import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";
import Navbar from "../components/navbar"

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Navbar currentUser={currentUser}/>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentUser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  return { pageProps, ...data };
};

export default AppComponent;
