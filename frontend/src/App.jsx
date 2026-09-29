import ProjectRoutes from "./Routes";
import { SearchProvider } from "./components/SeachContext";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <SearchProvider>
            <Toaster position="top-center" />
            <ProjectRoutes />
        </SearchProvider>
    );
}

export default App;