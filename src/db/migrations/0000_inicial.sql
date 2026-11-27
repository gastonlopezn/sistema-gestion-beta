CREATE TABLE `proveedores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(150) NOT NULL,
	`telefono` varchar(50),
	`email` varchar(150),
	`notas` text,
	`creado_en` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `proveedores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(64) NOT NULL,
	`descripcion` varchar(255) NOT NULL,
	`marca` varchar(100),
	`rubro` varchar(100),
	`compatibilidad` varchar(255),
	`proveedor_id` int,
	`costo` decimal(12,2) NOT NULL DEFAULT '0',
	`precio` decimal(12,2) NOT NULL DEFAULT '0',
	`stock` int NOT NULL DEFAULT 0,
	`stock_minimo` int NOT NULL DEFAULT 0,
	`activo` boolean NOT NULL DEFAULT true,
	`creado_en` timestamp NOT NULL DEFAULT (now()),
	`actualizado_en` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productos_id` PRIMARY KEY(`id`),
	CONSTRAINT `productos_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `clientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(150) NOT NULL,
	`tipo` enum('particular','taller','mayorista') NOT NULL DEFAULT 'particular',
	`telefono` varchar(50),
	`email` varchar(150),
	`cuit` varchar(13),
	`direccion` varchar(255),
	`creado_en` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `venta_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`venta_id` int NOT NULL,
	`producto_id` int NOT NULL,
	`cantidad` int NOT NULL,
	`precio_unitario` decimal(12,2) NOT NULL,
	`subtotal` decimal(12,2) NOT NULL,
	CONSTRAINT `venta_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ventas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cliente_id` int,
	`fecha` timestamp NOT NULL DEFAULT (now()),
	`medio_pago` enum('efectivo','transferencia','debito','credito','mercado_pago') NOT NULL DEFAULT 'efectivo',
	`total` decimal(12,2) NOT NULL,
	`notas` text,
	CONSTRAINT `ventas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `presupuesto_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`presupuesto_id` int NOT NULL,
	`producto_id` int NOT NULL,
	`cantidad` int NOT NULL,
	`precio_unitario` decimal(12,2) NOT NULL,
	`subtotal` decimal(12,2) NOT NULL,
	CONSTRAINT `presupuesto_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `presupuestos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cliente_id` int,
	`fecha` timestamp NOT NULL DEFAULT (now()),
	`valido_hasta` date,
	`estado` enum('pendiente','aceptado','rechazado','vencido') NOT NULL DEFAULT 'pendiente',
	`total` decimal(12,2) NOT NULL,
	`venta_id` int,
	`notas` text,
	CONSTRAINT `presupuestos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `movimientos_stock` (
	`id` int AUTO_INCREMENT NOT NULL,
	`producto_id` int NOT NULL,
	`tipo` enum('ingreso','venta','ajuste','devolucion') NOT NULL,
	`cantidad` int NOT NULL,
	`venta_id` int,
	`motivo` varchar(255),
	`fecha` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `movimientos_stock_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `productos` ADD CONSTRAINT `productos_proveedor_id_proveedores_id_fk` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `venta_items` ADD CONSTRAINT `venta_items_venta_id_ventas_id_fk` FOREIGN KEY (`venta_id`) REFERENCES `ventas`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `venta_items` ADD CONSTRAINT `venta_items_producto_id_productos_id_fk` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ventas` ADD CONSTRAINT `ventas_cliente_id_clientes_id_fk` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presupuesto_items` ADD CONSTRAINT `presupuesto_items_presupuesto_id_presupuestos_id_fk` FOREIGN KEY (`presupuesto_id`) REFERENCES `presupuestos`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presupuesto_items` ADD CONSTRAINT `presupuesto_items_producto_id_productos_id_fk` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presupuestos` ADD CONSTRAINT `presupuestos_cliente_id_clientes_id_fk` FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `presupuestos` ADD CONSTRAINT `presupuestos_venta_id_ventas_id_fk` FOREIGN KEY (`venta_id`) REFERENCES `ventas`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `movimientos_stock` ADD CONSTRAINT `movimientos_stock_producto_id_productos_id_fk` FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `movimientos_stock` ADD CONSTRAINT `movimientos_stock_venta_id_ventas_id_fk` FOREIGN KEY (`venta_id`) REFERENCES `ventas`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `productos_descripcion_idx` ON `productos` (`descripcion`);--> statement-breakpoint
CREATE INDEX `productos_marca_idx` ON `productos` (`marca`);--> statement-breakpoint
CREATE INDEX `ventas_fecha_idx` ON `ventas` (`fecha`);--> statement-breakpoint
CREATE INDEX `movimientos_producto_fecha_idx` ON `movimientos_stock` (`producto_id`,`fecha`);