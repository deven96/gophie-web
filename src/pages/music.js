import React, { Component } from "react";
import { GlobalStyles } from "../css/global";
import axios from "axios";
import MobileNavbar from "../components/mobileNav/MobileNavbar";
import PageSidebar from "../components/pageSidebar/PageSidebar";
import MainPanel from "./home.styles";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../css/theme";
import NavBar from "../components/navbar/Navbar";
import { 
  API_ENDPOINTS, 
  musicEngines, 
  nameToEngineMap,
  greekFromEnglish
} from "../utils";

export class Music extends Component {
  constructor(props) {
    super(props);

    this.state = {
      api: API_ENDPOINTS.mythra,
      server: musicEngines.get("Server1"),
      music: [],
      query: "Mirrors",
      isLoading: false,
      error: false,
      theme: "light",
    };
  }


  setTheme = () => {
    const theme = localStorage.getItem("theme");
    if (theme !== null) {
      this.switchTheme(theme === "light" ? "dark" : "light");
    }
  };

  handleServerChange(event) {
    event.persist();
    let server = nameToEngineMap.get(
      event.currentTarget.getAttribute("data-value")
    );
    this.setState(
      {
        server,
        movies: [],
        listIndex: 1,
      },
      () => {
        this.props.history.push(`/${greekFromEnglish(this.state.server)}`);
      }
    );
  }

  getMusic = () => {
    this.setState({
      isLoading: true,
    });
    axios.get(
      `${this.state.api}/search?engine=${this.state.server}&query=${this.state.query}`
    )
    .then((res) => {
      const music = res.data;
      this.setState({
        isLoading: false,
        music,
      })
    })

  }

  componentDidMount() {
    this.getMusic();
    window.addEventListener("storage", this.setTheme);
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.setTheme);
  }

  switchTheme = (mode) => {
    switch (mode) {
      case "light":
        localStorage.setItem("theme", "dark");
        this.setState({ theme: "dark" });
        break;
      case "dark":
        localStorage.setItem("theme", "light");
        this.setState({ theme: "light" });
        break;
      default:
        break;
    }
  };

  render() {
    const { theme } = this.state;
    const selectedTheme = theme !== "light" ? lightTheme : darkTheme;

    return (
      // Movie servers should not be showing on the Mobile music page
      // So MobileNavbar should be looked at
      <>
        <ThemeProvider theme={selectedTheme}>
          <>
            <GlobalStyles />
            <PageSidebar
              handleServerChange={this.handleServerChange.bind(this)}
              tour={this.startTour}
            />

            <MainPanel>
              <header>
                <div className="mtop">
                  <MobileNavbar
                    theme={theme}
                    switchTheme={() => this.switchTheme(this.state.theme)}
                    handleServerChange={this.handleServerChange.bind(this)}
                  />
                  <NavBar
                    onMusicPage
                    theme={theme}
                    switchTheme={() => this.switchTheme(this.state.theme)}
                  />
                </div>
              </header>
            </MainPanel>
          </>
        </ThemeProvider>
      </>
    ); }
}

export default Music;
