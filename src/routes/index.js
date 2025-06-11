
const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("API Poupa.ai"));
    console.log("Rota raiz configurada");
    
}

export default routes;