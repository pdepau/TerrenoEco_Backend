-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-11-2021 a las 15:40:48
-- Versión del servidor: 10.1.37-MariaDB
-- Versión de PHP: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `terreno_eco`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrada_diario`
--

CREATE TABLE `entrada_diario` (
  `ID` int(11) NOT NULL,
  `usuario` int(11) NOT NULL,
  `tipo` int(11) NOT NULL,
  `descripcion` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `ID` int(11) NOT NULL,
  `descripcion` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medalla`
--

CREATE TABLE `medalla` (
  `ID` int(11) NOT NULL,
  `imagen` varchar(300) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `requisito` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medida`
--

CREATE TABLE `medida` (
  `ID` int(11) NOT NULL,
  `valor` float NOT NULL,
  `latitud` float NOT NULL,
  `longitud` float NOT NULL,
  `tipo` int(11) NOT NULL,
  `tiempo` int(11) NOT NULL,
  `nodo` int(11) NOT NULL,
  `usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nodo`
--

CREATE TABLE `nodo` (
  `ID` int(11) NOT NULL,
  `usuario` int(11) NOT NULL,
  `estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sitio`
--

CREATE TABLE `sitio` (
  `ID` int(11) NOT NULL,
  `tipo` varchar(300) NOT NULL,
  `imagen` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo`
--

CREATE TABLE `tipo` (
  `ID` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `riesgo_alto` int(11) NOT NULL,
  `riesgo_medio` int(11) NOT NULL,
  `riesgo_leve` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `telefono` int(11) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_medalla`
--

CREATE TABLE `usuario_medalla` (
  `medalla` int(11) NOT NULL,
  `usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `entrada_diario`
--
ALTER TABLE `entrada_diario`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `usuario` (`usuario`),
  ADD KEY `tipo` (`tipo`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `medalla`
--
ALTER TABLE `medalla`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `medida`
--
ALTER TABLE `medida`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `tipo` (`tipo`,`nodo`,`usuario`),
  ADD KEY `nodo` (`nodo`),
  ADD KEY `usuario` (`usuario`);

--
-- Indices de la tabla `nodo`
--
ALTER TABLE `nodo`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `usuario` (`usuario`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `sitio`
--
ALTER TABLE `sitio`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `tipo`
--
ALTER TABLE `tipo`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `usuario_medalla`
--
ALTER TABLE `usuario_medalla`
  ADD KEY `medalla` (`medalla`,`usuario`),
  ADD KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `entrada_diario`
--
ALTER TABLE `entrada_diario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medalla`
--
ALTER TABLE `medalla`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medida`
--
ALTER TABLE `medida`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `nodo`
--
ALTER TABLE `nodo`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sitio`
--
ALTER TABLE `sitio`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo`
--
ALTER TABLE `tipo`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `entrada_diario`
--
ALTER TABLE `entrada_diario`
  ADD CONSTRAINT `entrada_diario_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`ID`),
  ADD CONSTRAINT `entrada_diario_ibfk_2` FOREIGN KEY (`tipo`) REFERENCES `sitio` (`ID`);

--
-- Filtros para la tabla `medida`
--
ALTER TABLE `medida`
  ADD CONSTRAINT `medida_ibfk_1` FOREIGN KEY (`tipo`) REFERENCES `tipo` (`ID`),
  ADD CONSTRAINT `medida_ibfk_2` FOREIGN KEY (`nodo`) REFERENCES `nodo` (`ID`),
  ADD CONSTRAINT `medida_ibfk_3` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`ID`);

--
-- Filtros para la tabla `nodo`
--
ALTER TABLE `nodo`
  ADD CONSTRAINT `nodo_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`ID`),
  ADD CONSTRAINT `nodo_ibfk_2` FOREIGN KEY (`estado`) REFERENCES `estado` (`ID`);

--
-- Filtros para la tabla `usuario_medalla`
--
ALTER TABLE `usuario_medalla`
  ADD CONSTRAINT `usuario_medalla_ibfk_1` FOREIGN KEY (`medalla`) REFERENCES `medalla` (`ID`),
  ADD CONSTRAINT `usuario_medalla_ibfk_2` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
