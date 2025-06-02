import app from "./server.js";

;(
    function (){
        const PORT = app.get('port');

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
)();