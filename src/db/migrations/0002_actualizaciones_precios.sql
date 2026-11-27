CREATE TABLE `actualizaciones_precios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fecha` timestamp NOT NULL DEFAULT (now()),
	`usuario` varchar(150) NOT NULL,
	`porcentaje` decimal(6,2) NOT NULL,
	`campo` enum('precio','costo','ambos') NOT NULL,
	`redondeo` int NOT NULL DEFAULT 0,
	`filtros` varchar(255) NOT NULL,
	`productos` int NOT NULL,
	CONSTRAINT `actualizaciones_precios_id` PRIMARY KEY(`id`)
);
