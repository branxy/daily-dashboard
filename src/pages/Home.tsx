import Tooltip from "../components/Tooltip";
import TaskApp from "../components/task-management/TaskApp";
import WeatherApp from "../components/weather/WeatherApp";

function Home() {
  return (
    <div className="home-page">
      <div className="dash-items">
        <div className="tasks-and-weather">
          <div className="tasks">
            <div className="dummy-div">
              <div className="title-and-info">
                <h2>Agenda</h2>
                <Tooltip text={"Today's tasks, filtered by date"} />
              </div>
              <TaskApp source={"dashboard"} />
            </div>
          </div>
          <div className="weather">
            <WeatherApp />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
