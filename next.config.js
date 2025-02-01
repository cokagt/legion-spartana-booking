module.exports = {
    output: "standalone", // Genera archivos de despliegue optimizados
    experimental: {
      outputFileTracingRoot: path.join(__dirname, "../../"), // Ajusta según tu estructura
    },
  };