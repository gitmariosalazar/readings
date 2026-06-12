--
-- PostgreSQL database dump
--

\restrict V7hAOJPpADIlxZHdYI2i7aUzgXasQw1eei9huVE8ldgDrGImH2ffKgtv1aD3b7S

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-01 15:56:28 -05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS worker_policy ON work_orders.orden_trabajo;
DROP POLICY IF EXISTS audit_superuser_full ON audit.registro;
DROP POLICY IF EXISTS audit_reader_full ON audit.registro;
DROP POLICY IF EXISTS audit_admin_full ON audit.registro;
DROP POLICY IF EXISTS alerta_reader ON audit.alerta;
DROP POLICY IF EXISTS alerta_admin ON audit.alerta;
ALTER TABLE IF EXISTS ONLY work_orders.tipo_trabajo DROP CONSTRAINT IF EXISTS tipo_trabajo_id_departamento_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_id_tipo_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_id_prioridad_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_estado_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.observaciones_orden_trabajo DROP CONSTRAINT IF EXISTS observaciones_orden_trabajo_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.historial_estado_orden_trabajo DROP CONSTRAINT IF EXISTS historial_estado_orden_trabajo_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.historial_estado_orden_trabajo DROP CONSTRAINT IF EXISTS historial_estado_orden_trabajo_id_estado_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.historial_estado_orden_trabajo DROP CONSTRAINT IF EXISTS fk_codigo_orden;
ALTER TABLE IF EXISTS ONLY work_orders.detalle_tipo_trabajo DROP CONSTRAINT IF EXISTS detalle_tipo_trabajo_id_tipo_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.detalle_prioridad DROP CONSTRAINT IF EXISTS detalle_prioridad_id_prioridad_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.detalle_orden_trabajo_material DROP CONSTRAINT IF EXISTS detalle_orden_trabajo_material_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_orden_trabajo_trabajador DROP CONSTRAINT IF EXISTS asignacion_orden_trabajo_trabajador_id_rol_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_orden_trabajo_trabajador DROP CONSTRAINT IF EXISTS asignacion_orden_trabajo_trabajador_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY work_orders.adjuntos_orden_trabajo DROP CONSTRAINT IF EXISTS adjuntos_orden_trabajo_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY public.usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_rol_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuario_permisos DROP CONSTRAINT IF EXISTS usuario_permisos_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuario_permisos DROP CONSTRAINT IF EXISTS usuario_permisos_permiso_id_fkey;
ALTER TABLE IF EXISTS ONLY public.tarifa DROP CONSTRAINT IF EXISTS tarifa_categoria_id_fkey;
ALTER TABLE IF EXISTS ONLY public.siguiente_lectura DROP CONSTRAINT IF EXISTS siguiente_lectura_ultima_lectura_id_fkey;
ALTER TABLE IF EXISTS ONLY public.siguiente_lectura DROP CONSTRAINT IF EXISTS siguiente_lectura_acometida_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_lectura_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_lectura_estado_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_lectura_estado_anterior_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_acometida_id_fkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_parent_rol_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS rol_permisos_rol_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS rol_permisos_permiso_id_fkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rangos_variables DROP CONSTRAINT IF EXISTS rangos_variables_tarifa_id_fkey;
ALTER TABLE IF EXISTS ONLY public.rangos_variables DROP CONSTRAINT IF EXISTS rangos_variables_servicio_id_fkey;
ALTER TABLE IF EXISTS ONLY public.qrcode DROP CONSTRAINT IF EXISTS qrcode_acometida_id_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_estados_acometida DROP CONSTRAINT IF EXISTS historial_estados_acometida_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_estados_acometida DROP CONSTRAINT IF EXISTS historial_estados_acometida_estado_id_fkey;
ALTER TABLE IF EXISTS ONLY public.historial_estados_acometida DROP CONSTRAINT IF EXISTS historial_estados_acometida_acometida_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuario_lectura DROP CONSTRAINT IF EXISTS fk_usuario_lectura_usuario;
ALTER TABLE IF EXISTS ONLY public.usuario_lectura DROP CONSTRAINT IF EXISTS fk_usuario_lectura_lectura;
ALTER TABLE IF EXISTS ONLY public.usuario_factura DROP CONSTRAINT IF EXISTS fk_usuario_factura_usuario;
ALTER TABLE IF EXISTS ONLY public.usuario_factura DROP CONSTRAINT IF EXISTS fk_usuario_factura_factura;
ALTER TABLE IF EXISTS ONLY public.titulo_dato DROP CONSTRAINT IF EXISTS fk_titulo_dato_tipo;
ALTER TABLE IF EXISTS ONLY public.titulo_dato DROP CONSTRAINT IF EXISTS fk_titulo_dato_cliente;
ALTER TABLE IF EXISTS ONLY public.telefono DROP CONSTRAINT IF EXISTS fk_telefono_tipo;
ALTER TABLE IF EXISTS ONLY public.telefono_persona_natural DROP CONSTRAINT IF EXISTS fk_telefono_persona_natural_telefono;
ALTER TABLE IF EXISTS ONLY public.telefono_persona_natural DROP CONSTRAINT IF EXISTS fk_telefono_persona_natural_cliente;
ALTER TABLE IF EXISTS ONLY public.telefono_empresa DROP CONSTRAINT IF EXISTS fk_telefono_empresa_telefono;
ALTER TABLE IF EXISTS ONLY public.telefono_empresa DROP CONSTRAINT IF EXISTS fk_telefono_empresa_empresa;
ALTER TABLE IF EXISTS ONLY public.telefono DROP CONSTRAINT IF EXISTS fk_telefono_cliente;
ALTER TABLE IF EXISTS ONLY public.provincia DROP CONSTRAINT IF EXISTS fk_provincia_pais;
ALTER TABLE IF EXISTS ONLY public.predio DROP CONSTRAINT IF EXISTS fk_predio_tipo_predio;
ALTER TABLE IF EXISTS ONLY public.permisos DROP CONSTRAINT IF EXISTS fk_permisos_categoria;
ALTER TABLE IF EXISTS ONLY public.parroquia DROP CONSTRAINT IF EXISTS fk_parroquia_tipo;
ALTER TABLE IF EXISTS ONLY public.parroquia DROP CONSTRAINT IF EXISTS fk_parroquia_canton;
ALTER TABLE IF EXISTS ONLY public.observacion_lectura DROP CONSTRAINT IF EXISTS fk_observacion_lectura_observacion;
ALTER TABLE IF EXISTS ONLY public.observacion_lectura DROP CONSTRAINT IF EXISTS fk_observacion_lectura_lectura;
ALTER TABLE IF EXISTS ONLY public.observacion_factura DROP CONSTRAINT IF EXISTS fk_observacion_factura_observacion;
ALTER TABLE IF EXISTS ONLY public.observacion_factura DROP CONSTRAINT IF EXISTS fk_observacion_factura_factura;
ALTER TABLE IF EXISTS ONLY public.observacion_acometida DROP CONSTRAINT IF EXISTS fk_observacion_acometida_observacion;
ALTER TABLE IF EXISTS ONLY public.observacion_acometida DROP CONSTRAINT IF EXISTS fk_observacion_acometida_acometida;
ALTER TABLE IF EXISTS ONLY public.lectura DROP CONSTRAINT IF EXISTS fk_lectura_tipo_novedad_lectura;
ALTER TABLE IF EXISTS ONLY public.lectura DROP CONSTRAINT IF EXISTS fk_lectura_lectura_estado;
ALTER TABLE IF EXISTS ONLY public.lectura_estado DROP CONSTRAINT IF EXISTS fk_lectura_estado_tipo_estado_lectura;
ALTER TABLE IF EXISTS ONLY public.lectura DROP CONSTRAINT IF EXISTS fk_lectura_acometida;
ALTER TABLE IF EXISTS ONLY public.foto_lectura DROP CONSTRAINT IF EXISTS fk_foto_lectura_lectura;
ALTER TABLE IF EXISTS ONLY public.foto_acometida DROP CONSTRAINT IF EXISTS fk_foto_acometida_acometida;
ALTER TABLE IF EXISTS ONLY public.factura DROP CONSTRAINT IF EXISTS fk_factura_forma_pago;
ALTER TABLE IF EXISTS ONLY public.factura DROP CONSTRAINT IF EXISTS fk_factura_estado_pago;
ALTER TABLE IF EXISTS ONLY public.factura DROP CONSTRAINT IF EXISTS fk_factura_cliente;
ALTER TABLE IF EXISTS ONLY public.empresa DROP CONSTRAINT IF EXISTS fk_empresa_parroquia;
ALTER TABLE IF EXISTS ONLY public.empresa DROP CONSTRAINT IF EXISTS fk_empresa_cliente;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS fk_empleados_usuario;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS fk_empleados_ciudadano;
ALTER TABLE IF EXISTS ONLY public.direccion DROP CONSTRAINT IF EXISTS fk_direccion_parroquia;
ALTER TABLE IF EXISTS ONLY public.correo_persona_natural DROP CONSTRAINT IF EXISTS fk_correo_persona_natural_correo;
ALTER TABLE IF EXISTS ONLY public.correo_persona_natural DROP CONSTRAINT IF EXISTS fk_correo_persona_natural_cliente;
ALTER TABLE IF EXISTS ONLY public.correo_empresa DROP CONSTRAINT IF EXISTS fk_correo_empresa_empresa;
ALTER TABLE IF EXISTS ONLY public.correo_empresa DROP CONSTRAINT IF EXISTS fk_correo_empresa_correo;
ALTER TABLE IF EXISTS ONLY public.correo_electronico DROP CONSTRAINT IF EXISTS fk_correo_electronico_cliente;
ALTER TABLE IF EXISTS ONLY public.consumo_promedio DROP CONSTRAINT IF EXISTS fk_consumo_promedio_acometida;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS fk_cliente_usuario_cliente;
ALTER TABLE IF EXISTS ONLY public.cliente DROP CONSTRAINT IF EXISTS fk_cliente_tipo_identificacion;
ALTER TABLE IF EXISTS ONLY public.predio DROP CONSTRAINT IF EXISTS fk_cliente_predio;
ALTER TABLE IF EXISTS ONLY public.cliente_persona_natural DROP CONSTRAINT IF EXISTS fk_cliente_persona_natural_cliente;
ALTER TABLE IF EXISTS ONLY public.cliente_persona_natural DROP CONSTRAINT IF EXISTS fk_cliente_persona_natural_ciudadano;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS fk_ciudadano_sexo;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS fk_ciudadano_profesion;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS fk_ciudadano_parroquia;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS fk_ciudadano_estado_civil;
ALTER TABLE IF EXISTS ONLY public.canton DROP CONSTRAINT IF EXISTS fk_canton_provincia;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS fk_acometida_zona;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS fk_acometida_tarifa;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS fk_acometida_predio;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS fk_acometida_cliente;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_tipo_contrato_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_supervisor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_sexo_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_estado_empleado_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_ciudadano_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_cargo_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleado_zona DROP CONSTRAINT IF EXISTS empleado_zona_zona_id_fkey;
ALTER TABLE IF EXISTS ONLY public.empleado_zona DROP CONSTRAINT IF EXISTS empleado_zona_empleado_id_fkey;
ALTER TABLE IF EXISTS ONLY public.componentes_fijos DROP CONSTRAINT IF EXISTS componentes_fijos_tarifa_id_fkey;
ALTER TABLE IF EXISTS ONLY public.componentes_fijos DROP CONSTRAINT IF EXISTS componentes_fijos_servicio_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_estado_cliente_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS acometida_estado_id_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud_orden_trabajo DROP CONSTRAINT IF EXISTS solicitud_orden_trabajo_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud_orden_trabajo DROP CONSTRAINT IF EXISTS solicitud_orden_trabajo_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_id_cliente_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_id_analista_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_id_registrador_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_id_contrato_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.notificacion DROP CONSTRAINT IF EXISTS notificacion_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.notificacion DROP CONSTRAINT IF EXISTS notificacion_id_destinatario_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_id_orden_trabajo_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_id_aprobador_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_id_usuario_accion_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_id_concepto_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_id_cajero_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.documento_adjunto DROP CONSTRAINT IF EXISTS documento_adjunto_id_validador_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.documento_adjunto DROP CONSTRAINT IF EXISTS documento_adjunto_id_tipo_documento_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.documento_adjunto DROP CONSTRAINT IF EXISTS documento_adjunto_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_tarifa_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_solicitud_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_medidor_fkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_generador_fkey;
DROP TRIGGER IF EXISTS trg_set_updated_at ON work_orders.auditoria_inv_inventario;
DROP TRIGGER IF EXISTS trg_registrar_cambio_estado ON work_orders.orden_trabajo;
DROP TRIGGER IF EXISTS trg_generar_codigo_orden ON work_orders.orden_trabajo;
DROP TRIGGER IF EXISTS trg_update_timestamp_siguiente_lectura ON public.siguiente_lectura;
DROP TRIGGER IF EXISTS trg_update_timestamp_seguimiento_lectura ON public.seguimiento_lectura;
DROP TRIGGER IF EXISTS trg_update_meter_reading ON public.acometida;
DROP TRIGGER IF EXISTS trg_update_empleados_timestamp ON public.empleados;
DROP TRIGGER IF EXISTS trg_update_consumo_promedio ON public.lectura;
DROP TRIGGER IF EXISTS trg_update_cliente_usuario_timestamp ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_insert_initial_reading_full ON public.acometida;
DROP TRIGGER IF EXISTS trg_insert_cambio_medidor_reading ON public.acometida;
DROP TRIGGER IF EXISTS trg_gestionar_estados ON public.historial_estados_acometida;
DROP TRIGGER IF EXISTS trg_control_siguiente_mensual ON public.lectura;
DROP TRIGGER IF EXISTS trg_cliente_usuario_lockout ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_block_duplicate_lectura ON public.lectura;
DROP TRIGGER IF EXISTS trg_auto_cierre_auditoria ON public.auditoria_lectura_sector;
DROP TRIGGER IF EXISTS trg_auditar_lectura ON public.lectura;
DROP TRIGGER IF EXISTS trg_audit_zona ON public.zona;
DROP TRIGGER IF EXISTS trg_audit_usuarios ON public.usuarios;
DROP TRIGGER IF EXISTS trg_audit_usuario_roles ON public.usuario_roles;
DROP TRIGGER IF EXISTS trg_audit_usuario_permisos ON public.usuario_permisos;
DROP TRIGGER IF EXISTS trg_audit_titulo_dato ON public.titulo_dato;
DROP TRIGGER IF EXISTS trg_audit_tarifa ON public.tarifa;
DROP TRIGGER IF EXISTS trg_audit_siguiente_lectura ON public.siguiente_lectura;
DROP TRIGGER IF EXISTS trg_audit_roles ON public.roles;
DROP TRIGGER IF EXISTS trg_audit_rol_permisos ON public.rol_permisos;
DROP TRIGGER IF EXISTS trg_audit_refresh_tokens ON public.refresh_tokens;
DROP TRIGGER IF EXISTS trg_audit_rangos_variables ON public.rangos_variables;
DROP TRIGGER IF EXISTS trg_audit_predio ON public.predio;
DROP TRIGGER IF EXISTS trg_audit_permisos ON public.permisos;
DROP TRIGGER IF EXISTS trg_audit_lectura ON public.lectura;
DROP TRIGGER IF EXISTS trg_audit_factura ON public.factura;
DROP TRIGGER IF EXISTS trg_audit_empresa ON public.empresa;
DROP TRIGGER IF EXISTS trg_audit_empleados ON public.empleados;
DROP TRIGGER IF EXISTS trg_audit_empleado_zona ON public.empleado_zona;
DROP TRIGGER IF EXISTS trg_audit_componentes_fijos ON public.componentes_fijos;
DROP TRIGGER IF EXISTS trg_audit_cliente_usuario ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_audit_cliente_persona_natural ON public.cliente_persona_natural;
DROP TRIGGER IF EXISTS trg_audit_cliente ON public.cliente;
DROP TRIGGER IF EXISTS trg_audit_ciudadano ON public.ciudadano;
DROP TRIGGER IF EXISTS trg_audit_categoria ON public.categoria;
DROP TRIGGER IF EXISTS trg_audit_acometida ON public.acometida;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.zona;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuarios;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuario_roles;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuario_permisos;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuario_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.usuario_factura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.titulo_dato;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_titulo_dato;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_telefono;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_relacion_familiar;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_predio;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_parroquia;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_novedad_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_identificacion;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_estado_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tipo_contrato;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.telefono_persona_natural;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.telefono_empresa;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.telefono;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.tarifa;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.siguiente_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.sexo;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.servicio;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.seguimiento_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.roles;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.rol_permisos;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.refresh_tokens;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.rangos_variables;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.qrcode;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.provincia;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.profesion;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.predio;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.permisos;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.permiso_categoria;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.parroquia;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.pais;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.observacion_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.observacion_factura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.observacion_acometida;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.observacion;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.lectura_estado;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.foto_lectura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.foto_acometida;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.forma_pago;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.factura;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.estado_pago;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.estado_empleado;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.estado_cliente_usuario;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.estado_civil;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.empresa;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.empleados;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.empleado_zona;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.direccion;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.correo_persona_natural;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.correo_empresa;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.correo_electronico;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.consumo_promedio;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.componentes_fijos;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.cliente_usuario;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.cliente_persona_natural;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.cliente;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.claves_sql2000;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.ciudadano;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.categoria;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.cargo;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.canton;
DROP TRIGGER IF EXISTS trg_actualizar_updated_at ON public.acometida;
DROP TRIGGER IF EXISTS trg_config_updated_at ON audit.tabla_config;
DROP TRIGGER IF EXISTS trg_state_machine ON acometidas.solicitud;
DROP TRIGGER IF EXISTS trg_solicitud_updated_at ON acometidas.solicitud;
DROP TRIGGER IF EXISTS trg_medidor_updated_at ON acometidas.inventario_medidor;
DROP TRIGGER IF EXISTS trg_informe_updated_at ON acometidas.informe_inspeccion;
DROP TRIGGER IF EXISTS trg_factura_updated_at ON acometidas.factura_inspeccion;
DROP TRIGGER IF EXISTS trg_documento_updated_at ON acometidas.documento_adjunto;
DROP TRIGGER IF EXISTS trg_contrato_updated_at ON acometidas.contrato_servicio;
DROP TRIGGER IF EXISTS trg_catastro_updated_at ON acometidas.registro_catastral;
DROP INDEX IF EXISTS work_orders.idx_tipo_trabajo_nombre;
DROP INDEX IF EXISTS work_orders.idx_rol_trabajador_nombre;
DROP INDEX IF EXISTS work_orders.idx_prioridad_nivel;
DROP INDEX IF EXISTS work_orders.idx_orden_trabajo_secuencial;
DROP INDEX IF EXISTS work_orders.idx_orden_trabajo_metadata;
DROP INDEX IF EXISTS work_orders.idx_orden_trabajo_fecha;
DROP INDEX IF EXISTS work_orders.idx_orden_trabajo_estado;
DROP INDEX IF EXISTS work_orders.idx_orden_trabajo_coordenadas;
DROP INDEX IF EXISTS work_orders.idx_orden_trabajo_codigo_orden;
DROP INDEX IF EXISTS work_orders.idx_orden_trabajo_cliente;
DROP INDEX IF EXISTS work_orders.idx_observaciones_orden_trabajo;
DROP INDEX IF EXISTS work_orders.idx_historial_estado_orden_trabajo_orden;
DROP INDEX IF EXISTS work_orders.idx_estado_orden_trabajo_nombre;
DROP INDEX IF EXISTS work_orders.idx_detalle_tipo_trabajo_tipo;
DROP INDEX IF EXISTS work_orders.idx_detalle_tipo_trabajo_detalle;
DROP INDEX IF EXISTS work_orders.idx_detalle_prioridad_prioridad;
DROP INDEX IF EXISTS work_orders.idx_detalle_prioridad_detalle;
DROP INDEX IF EXISTS work_orders.idx_detalle_orden_trabajo_material_orden;
DROP INDEX IF EXISTS work_orders.idx_asignacion_orden_trabajo;
DROP INDEX IF EXISTS work_orders.idx_adjuntos_orden_trabajo;
DROP INDEX IF EXISTS public.idx_zona_nombre;
DROP INDEX IF EXISTS public.idx_zona_codigo;
DROP INDEX IF EXISTS public.idx_usuarios_username;
DROP INDEX IF EXISTS public.idx_usuarios_email;
DROP INDEX IF EXISTS public.idx_usuario_roles_usuario_id;
DROP INDEX IF EXISTS public.idx_usuario_roles_rol_id;
DROP INDEX IF EXISTS public.idx_usuario_permisos_usuario_id;
DROP INDEX IF EXISTS public.idx_usuario_permisos_permiso_id;
DROP INDEX IF EXISTS public.idx_usuario_lectura_usuario_id;
DROP INDEX IF EXISTS public.idx_usuario_lectura_lectura_id;
DROP INDEX IF EXISTS public.idx_usuario_factura_usuario_id;
DROP INDEX IF EXISTS public.idx_usuario_factura_fecha_registro;
DROP INDEX IF EXISTS public.idx_usuario_factura_factura_id;
DROP INDEX IF EXISTS public.idx_titulo_dato_tipo_titulo_dato_id;
DROP INDEX IF EXISTS public.idx_titulo_dato_fecha_vencimiento;
DROP INDEX IF EXISTS public.idx_titulo_dato_fecha_emision;
DROP INDEX IF EXISTS public.idx_titulo_dato_estado;
DROP INDEX IF EXISTS public.idx_titulo_dato_cliente_id;
DROP INDEX IF EXISTS public.idx_tipo_titulo_dato_nombre;
DROP INDEX IF EXISTS public.idx_tipo_telefono_nombre;
DROP INDEX IF EXISTS public.idx_tipo_relacion_familiar_parentesco;
DROP INDEX IF EXISTS public.idx_tipo_parroquia_nombre;
DROP INDEX IF EXISTS public.idx_tipo_novedad_lectura_nombre;
DROP INDEX IF EXISTS public.idx_tipo_identificacion_nombre;
DROP INDEX IF EXISTS public.idx_tipo_estado_lectura_nombre;
DROP INDEX IF EXISTS public.idx_tipo_estado_lectura_codigo;
DROP INDEX IF EXISTS public.idx_telefono_tipo_telefono_id;
DROP INDEX IF EXISTS public.idx_telefono_persona_natural_telefono_id;
DROP INDEX IF EXISTS public.idx_telefono_persona_natural_cliente_persona_natural_id;
DROP INDEX IF EXISTS public.idx_telefono_numero;
DROP INDEX IF EXISTS public.idx_telefono_empresa_telefono_id;
DROP INDEX IF EXISTS public.idx_telefono_empresa_empresa_id;
DROP INDEX IF EXISTS public.idx_telefono_cliente_id;
DROP INDEX IF EXISTS public.idx_tarifa_effective_date;
DROP INDEX IF EXISTS public.idx_tarifa_categoria_id;
DROP INDEX IF EXISTS public.idx_siguiente_lectura_ultima_lectura_id;
DROP INDEX IF EXISTS public.idx_siguiente_lectura_fecha_siguiente_lectura;
DROP INDEX IF EXISTS public.idx_siguiente_lectura_created_at;
DROP INDEX IF EXISTS public.idx_siguiente_lectura_acometida_id;
DROP INDEX IF EXISTS public.idx_sexo_nombre;
DROP INDEX IF EXISTS public.idx_servicio_nombre;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_usuario_id;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_lectura_id;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_lectura_estado_id;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_lectura_estado_anterior_id;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_created_at;
DROP INDEX IF EXISTS public.idx_seguimiento_lectura_acometida_id;
DROP INDEX IF EXISTS public.idx_roles_parent_rol_id;
DROP INDEX IF EXISTS public.idx_roles_nombre;
DROP INDEX IF EXISTS public.idx_rol_permisos_rol_id;
DROP INDEX IF EXISTS public.idx_rol_permisos_permiso_id;
DROP INDEX IF EXISTS public.idx_refresh_user;
DROP INDEX IF EXISTS public.idx_refresh_revoked;
DROP INDEX IF EXISTS public.idx_refresh_expires;
DROP INDEX IF EXISTS public.idx_rangos_variables_tarifa_id;
DROP INDEX IF EXISTS public.idx_rangos_variables_servicio_id;
DROP INDEX IF EXISTS public.idx_qrcode_created_at;
DROP INDEX IF EXISTS public.idx_qrcode_acometida_id;
DROP INDEX IF EXISTS public.idx_provincia_pais_id;
DROP INDEX IF EXISTS public.idx_provincia_nombre;
DROP INDEX IF EXISTS public.idx_profesion_nombre;
DROP INDEX IF EXISTS public.idx_predio_zona_geometrica;
DROP INDEX IF EXISTS public.idx_predio_valor_terreno;
DROP INDEX IF EXISTS public.idx_predio_valor_construccion;
DROP INDEX IF EXISTS public.idx_predio_valor_comercial;
DROP INDEX IF EXISTS public.idx_predio_updated_at;
DROP INDEX IF EXISTS public.idx_predio_tipo_predio_id;
DROP INDEX IF EXISTS public.idx_predio_sector;
DROP INDEX IF EXISTS public.idx_predio_referencia;
DROP INDEX IF EXISTS public.idx_predio_precision;
DROP INDEX IF EXISTS public.idx_predio_fecha_geolocalizacion;
DROP INDEX IF EXISTS public.idx_predio_direccion;
DROP INDEX IF EXISTS public.idx_predio_created_at;
DROP INDEX IF EXISTS public.idx_predio_coordenadas;
DROP INDEX IF EXISTS public.idx_predio_cliente_id;
DROP INDEX IF EXISTS public.idx_predio_clave_catastral;
DROP INDEX IF EXISTS public.idx_predio_callejon;
DROP INDEX IF EXISTS public.idx_predio_area_terreno;
DROP INDEX IF EXISTS public.idx_predio_area_construccion;
DROP INDEX IF EXISTS public.idx_predio_altitud;
DROP INDEX IF EXISTS public.idx_permisos_nombre;
DROP INDEX IF EXISTS public.idx_parroquia_tipo_parroquia_id;
DROP INDEX IF EXISTS public.idx_parroquia_nombre;
DROP INDEX IF EXISTS public.idx_parroquia_canton_id;
DROP INDEX IF EXISTS public.idx_pais_nombre;
DROP INDEX IF EXISTS public.idx_observacion_titulo_observacion;
DROP INDEX IF EXISTS public.idx_observacion_lectura_observacion_id;
DROP INDEX IF EXISTS public.idx_observacion_lectura_lectura_id;
DROP INDEX IF EXISTS public.idx_observacion_lectura_fecha_registro;
DROP INDEX IF EXISTS public.idx_observacion_factura_observacion_id;
DROP INDEX IF EXISTS public.idx_observacion_factura_fecha_registro;
DROP INDEX IF EXISTS public.idx_observacion_factura_factura_id;
DROP INDEX IF EXISTS public.idx_observacion_acometida_observacion_id;
DROP INDEX IF EXISTS public.idx_observacion_acometida_fecha_registro;
DROP INDEX IF EXISTS public.idx_observacion_acometida_acometida_id;
DROP INDEX IF EXISTS public.idx_lectura_tipo_novedad_lectura_id;
DROP INDEX IF EXISTS public.idx_lectura_sector;
DROP INDEX IF EXISTS public.idx_lectura_lectura_estado_id;
DROP INDEX IF EXISTS public.idx_lectura_fecha_lectura;
DROP INDEX IF EXISTS public.idx_lectura_estado_tipo_estado_lectura_id;
DROP INDEX IF EXISTS public.idx_lectura_estado_nombre;
DROP INDEX IF EXISTS public.idx_lectura_estado_codigo;
DROP INDEX IF EXISTS public.idx_lectura_cuenta;
DROP INDEX IF EXISTS public.idx_lectura_clave_catastral;
DROP INDEX IF EXISTS public.idx_lectura_acometida_id;
DROP INDEX IF EXISTS public.idx_foto_lectura_lectura_id;
DROP INDEX IF EXISTS public.idx_foto_lectura_created_at;
DROP INDEX IF EXISTS public.idx_foto_lectura_clave_catastral;
DROP INDEX IF EXISTS public.idx_foto_acometida_created_at;
DROP INDEX IF EXISTS public.idx_foto_acometida_acometida_id;
DROP INDEX IF EXISTS public.idx_forma_pago_nombre;
DROP INDEX IF EXISTS public.idx_factura_numero_factura;
DROP INDEX IF EXISTS public.idx_factura_forma_pago_id;
DROP INDEX IF EXISTS public.idx_factura_fecha_vencimiento;
DROP INDEX IF EXISTS public.idx_factura_fecha_registro;
DROP INDEX IF EXISTS public.idx_factura_estado_pago_id;
DROP INDEX IF EXISTS public.idx_factura_cliente_id;
DROP INDEX IF EXISTS public.idx_estado_pago_nombre;
DROP INDEX IF EXISTS public.idx_estado_civil_nombre;
DROP INDEX IF EXISTS public.idx_empresa_ruc;
DROP INDEX IF EXISTS public.idx_empresa_razon_social;
DROP INDEX IF EXISTS public.idx_empresa_parroquia_id;
DROP INDEX IF EXISTS public.idx_empresa_nombre_comercial;
DROP INDEX IF EXISTS public.idx_empresa_cliente_id;
DROP INDEX IF EXISTS public.idx_empleados_usuario_id;
DROP INDEX IF EXISTS public.idx_empleados_fecha_ingreso;
DROP INDEX IF EXISTS public.idx_empleados_estado_empleado_id;
DROP INDEX IF EXISTS public.idx_empleados_deleted_at;
DROP INDEX IF EXISTS public.idx_empleados_ciudadano_id;
DROP INDEX IF EXISTS public.idx_empleados_cargo_id;
DROP INDEX IF EXISTS public.idx_direccion_parroquia_id;
DROP INDEX IF EXISTS public.idx_correo_persona_natural_correo_electronico_id;
DROP INDEX IF EXISTS public.idx_correo_persona_natural_cliente_persona_natural_id;
DROP INDEX IF EXISTS public.idx_correo_empresa_empresa_id;
DROP INDEX IF EXISTS public.idx_correo_empresa_correo_electronico_id;
DROP INDEX IF EXISTS public.idx_correo_electronico_correo;
DROP INDEX IF EXISTS public.idx_correo_electronico_cliente_id;
DROP INDEX IF EXISTS public.idx_consumo_promedio_updated_at;
DROP INDEX IF EXISTS public.idx_componentes_fijos_tarifa_id;
DROP INDEX IF EXISTS public.idx_componentes_fijos_servicio_id;
DROP INDEX IF EXISTS public.idx_cliente_usuario_locked_out;
DROP INDEX IF EXISTS public.idx_cliente_usuario_is_active;
DROP INDEX IF EXISTS public.idx_cliente_usuario_failed_attempts;
DROP INDEX IF EXISTS public.idx_cliente_usuario_estado;
DROP INDEX IF EXISTS public.idx_cliente_usuario_email;
DROP INDEX IF EXISTS public.idx_cliente_usuario_deleted_at;
DROP INDEX IF EXISTS public.idx_cliente_usuario_created_at;
DROP INDEX IF EXISTS public.idx_cliente_usuario_cliente_id;
DROP INDEX IF EXISTS public.idx_cliente_tipo_identificacion_id;
DROP INDEX IF EXISTS public.idx_cliente_persona_natural_cliente_id;
DROP INDEX IF EXISTS public.idx_cliente_persona_natural_ciudadano_id;
DROP INDEX IF EXISTS public.idx_ciudadano_sexo_id;
DROP INDEX IF EXISTS public.idx_ciudadano_profesion_id;
DROP INDEX IF EXISTS public.idx_ciudadano_parroquia_id;
DROP INDEX IF EXISTS public.idx_ciudadano_nombres;
DROP INDEX IF EXISTS public.idx_ciudadano_estado_civil_id;
DROP INDEX IF EXISTS public.idx_ciudadano_apellidos;
DROP INDEX IF EXISTS public.idx_categoria_nombre;
DROP INDEX IF EXISTS public.idx_canton_provincia_id;
DROP INDEX IF EXISTS public.idx_canton_nombre;
DROP INDEX IF EXISTS public.idx_audit_busqueda;
DROP INDEX IF EXISTS public.idx_acometida_zona_id;
DROP INDEX IF EXISTS public.idx_acometida_tarifa_id;
DROP INDEX IF EXISTS public.idx_acometida_sector;
DROP INDEX IF EXISTS public.idx_acometida_fecha_instalacion;
DROP INDEX IF EXISTS public.idx_acometida_estado_activo;
DROP INDEX IF EXISTS public.idx_acometida_cuenta;
DROP INDEX IF EXISTS public.idx_acometida_cliente_id;
DROP INDEX IF EXISTS public.idx_acometida_clave_catastral;
DROP INDEX IF EXISTS audit.idx_refresh_token_usuario;
DROP INDEX IF EXISTS audit.idx_refresh_token_hash;
DROP INDEX IF EXISTS audit.idx_refresh_token_expiration;
DROP INDEX IF EXISTS audit.idx_audit_sesion_usuario_ts;
DROP INDEX IF EXISTS audit.idx_audit_sesion_ip;
DROP INDEX IF EXISTS audit.idx_audit_sesion_evento;
DROP INDEX IF EXISTS audit.idx_audit_reg_usuario_ts;
DROP INDEX IF EXISTS audit.idx_audit_reg_ts_desc;
DROP INDEX IF EXISTS audit.idx_audit_reg_tabla_ts;
DROP INDEX IF EXISTS audit.idx_audit_reg_sesion;
DROP INDEX IF EXISTS audit.idx_audit_reg_pk_gin;
DROP INDEX IF EXISTS audit.idx_audit_reg_operacion;
DROP INDEX IF EXISTS audit.idx_audit_reg_diff_gin;
DROP INDEX IF EXISTS audit.idx_alerta_usuario;
DROP INDEX IF EXISTS audit.idx_alerta_tipo;
DROP INDEX IF EXISTS audit.idx_alerta_severidad_ts;
DROP INDEX IF EXISTS audit.idx_alerta_no_resuelta;
DROP INDEX IF EXISTS acometidas.idx_solicitud_ot_sol;
DROP INDEX IF EXISTS acometidas.idx_solicitud_ot_ot;
DROP INDEX IF EXISTS acometidas.idx_solicitud_geom;
DROP INDEX IF EXISTS acometidas.idx_solicitud_estado;
DROP INDEX IF EXISTS acometidas.idx_solicitud_datos;
DROP INDEX IF EXISTS acometidas.idx_solicitud_cliente;
DROP INDEX IF EXISTS acometidas.idx_solicitud_catastral;
DROP INDEX IF EXISTS acometidas.idx_notif_solicitud;
DROP INDEX IF EXISTS acometidas.idx_notif_enviado;
DROP INDEX IF EXISTS acometidas.idx_notif_destinatario;
DROP INDEX IF EXISTS acometidas.idx_historial_solicitud;
DROP INDEX IF EXISTS acometidas.idx_historial_fecha;
DROP INDEX IF EXISTS acometidas.idx_doc_solicitud;
DROP INDEX IF EXISTS acometidas.idx_doc_estado;
DROP INDEX IF EXISTS acometidas.idx_catastro_medidor;
DROP INDEX IF EXISTS acometidas.idx_catastro_geom;
DROP INDEX IF EXISTS acometidas.idx_catastro_clave;
ALTER TABLE IF EXISTS ONLY work_orders.tipo_trabajo DROP CONSTRAINT IF EXISTS tipo_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.tipo_trabajo DROP CONSTRAINT IF EXISTS tipo_trabajo_nombre_key;
ALTER TABLE IF EXISTS ONLY work_orders.rol_trabajador DROP CONSTRAINT IF EXISTS rol_trabajador_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.rol_trabajador DROP CONSTRAINT IF EXISTS rol_trabajador_nombre_key;
ALTER TABLE IF EXISTS ONLY work_orders.prioridad_orden_trabajo DROP CONSTRAINT IF EXISTS prioridad_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.prioridad_orden_trabajo DROP CONSTRAINT IF EXISTS prioridad_orden_trabajo_nivel_key;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.orden_trabajo DROP CONSTRAINT IF EXISTS orden_trabajo_codigo_orden_key;
ALTER TABLE IF EXISTS ONLY work_orders.observaciones_orden_trabajo DROP CONSTRAINT IF EXISTS observaciones_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.historial_estado_orden_trabajo DROP CONSTRAINT IF EXISTS historial_estado_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.estado_orden_trabajo DROP CONSTRAINT IF EXISTS estado_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.estado_orden_trabajo DROP CONSTRAINT IF EXISTS estado_orden_trabajo_nombre_estado_key;
ALTER TABLE IF EXISTS ONLY work_orders.detalle_tipo_trabajo DROP CONSTRAINT IF EXISTS detalle_tipo_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.detalle_prioridad DROP CONSTRAINT IF EXISTS detalle_prioridad_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.detalle_orden_trabajo_material DROP CONSTRAINT IF EXISTS detalle_orden_trabajo_material_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.departamento_trabajo DROP CONSTRAINT IF EXISTS departamento_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.departamento_trabajo DROP CONSTRAINT IF EXISTS departamento_trabajo_nombre_key;
ALTER TABLE IF EXISTS ONLY work_orders.auditoria_inv_inventario DROP CONSTRAINT IF EXISTS auditoria_inv_inventario_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_orden_trabajo_trabajador DROP CONSTRAINT IF EXISTS asignacion_orden_trabajo_trabajador_pkey;
ALTER TABLE IF EXISTS ONLY work_orders.asignacion_orden_trabajo_trabajador DROP CONSTRAINT IF EXISTS asignacion_orden_trabajo_trab_id_orden_trabajo_id_trabajado_key;
ALTER TABLE IF EXISTS ONLY work_orders.adjuntos_orden_trabajo DROP CONSTRAINT IF EXISTS adjuntos_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY public.zona DROP CONSTRAINT IF EXISTS zona_codigo_key;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_username_key;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_email_key;
ALTER TABLE IF EXISTS ONLY public.usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_usuario_id_rol_id_key;
ALTER TABLE IF EXISTS ONLY public.usuario_roles DROP CONSTRAINT IF EXISTS usuario_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.usuario_permisos DROP CONSTRAINT IF EXISTS usuario_permisos_usuario_id_permiso_id_key;
ALTER TABLE IF EXISTS ONLY public.usuario_permisos DROP CONSTRAINT IF EXISTS usuario_permisos_pkey;
ALTER TABLE IF EXISTS ONLY public.siguiente_lectura DROP CONSTRAINT IF EXISTS uq_siguiente_lectura_acometida;
ALTER TABLE IF EXISTS ONLY public.lectura_estado DROP CONSTRAINT IF EXISTS uq_lectura_estado_nombre;
ALTER TABLE IF EXISTS ONLY public.empresa DROP CONSTRAINT IF EXISTS uq_empresa_ruc;
ALTER TABLE IF EXISTS ONLY public.auditoria_lectura_sector DROP CONSTRAINT IF EXISTS uq_audit_mes_sector;
ALTER TABLE IF EXISTS ONLY public.tipo_predio DROP CONSTRAINT IF EXISTS tipopredio_nombre_key;
ALTER TABLE IF EXISTS ONLY public.tipo_novedad_lectura DROP CONSTRAINT IF EXISTS tipo_novedad_lectura_nombre_key;
ALTER TABLE IF EXISTS ONLY public.tipo_estado_lectura DROP CONSTRAINT IF EXISTS tipo_estado_lectura_nombre_key;
ALTER TABLE IF EXISTS ONLY public.tipo_estado_lectura DROP CONSTRAINT IF EXISTS tipo_estado_lectura_codigo_key;
ALTER TABLE IF EXISTS ONLY public.tipo_contrato DROP CONSTRAINT IF EXISTS tipo_contrato_pkey;
ALTER TABLE IF EXISTS ONLY public.tipo_contrato DROP CONSTRAINT IF EXISTS tipo_contrato_nombre_key;
ALTER TABLE IF EXISTS ONLY public.siguiente_lectura DROP CONSTRAINT IF EXISTS siguiente_lectura_pkey;
ALTER TABLE IF EXISTS ONLY public.servicio DROP CONSTRAINT IF EXISTS servicio_nombre_key;
ALTER TABLE IF EXISTS ONLY public.seguimiento_lectura DROP CONSTRAINT IF EXISTS seguimiento_lectura_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_nombre_key;
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS rol_permisos_rol_id_permiso_id_key;
ALTER TABLE IF EXISTS ONLY public.rol_permisos DROP CONSTRAINT IF EXISTS rol_permisos_pkey;
ALTER TABLE IF EXISTS ONLY public.respaldo_acometidas_2026 DROP CONSTRAINT IF EXISTS respaldo_acometidas_2026_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_hash_key;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_jti_key;
ALTER TABLE IF EXISTS ONLY public.rangos_variables DROP CONSTRAINT IF EXISTS rangos_variables_pkey;
ALTER TABLE IF EXISTS ONLY public.qrcode DROP CONSTRAINT IF EXISTS qrcode_pkey;
ALTER TABLE IF EXISTS ONLY public.qrcode DROP CONSTRAINT IF EXISTS qrcode_acometida_id_key;
ALTER TABLE IF EXISTS ONLY public.predio DROP CONSTRAINT IF EXISTS predio_clavecatastral_key;
ALTER TABLE IF EXISTS ONLY public.zona DROP CONSTRAINT IF EXISTS pk_zona;
ALTER TABLE IF EXISTS ONLY public.usuario_lectura DROP CONSTRAINT IF EXISTS pk_usuario_lectura;
ALTER TABLE IF EXISTS ONLY public.usuario_factura DROP CONSTRAINT IF EXISTS pk_usuario_factura;
ALTER TABLE IF EXISTS ONLY public.titulo_dato DROP CONSTRAINT IF EXISTS pk_titulo_dato;
ALTER TABLE IF EXISTS ONLY public.tipo_predio DROP CONSTRAINT IF EXISTS pk_tipopredio;
ALTER TABLE IF EXISTS ONLY public.tipo_titulo_dato DROP CONSTRAINT IF EXISTS pk_tipo_titulo_dato;
ALTER TABLE IF EXISTS ONLY public.tipo_telefono DROP CONSTRAINT IF EXISTS pk_tipo_telefono;
ALTER TABLE IF EXISTS ONLY public.tipo_relacion_familiar DROP CONSTRAINT IF EXISTS pk_tipo_relacion_familiar;
ALTER TABLE IF EXISTS ONLY public.tipo_parroquia DROP CONSTRAINT IF EXISTS pk_tipo_parroquia;
ALTER TABLE IF EXISTS ONLY public.tipo_novedad_lectura DROP CONSTRAINT IF EXISTS pk_tipo_novedad_lectura;
ALTER TABLE IF EXISTS ONLY public.tipo_identificacion DROP CONSTRAINT IF EXISTS pk_tipo_identificacion;
ALTER TABLE IF EXISTS ONLY public.tipo_estado_lectura DROP CONSTRAINT IF EXISTS pk_tipo_estado_lectura;
ALTER TABLE IF EXISTS ONLY public.telefono_persona_natural DROP CONSTRAINT IF EXISTS pk_telefono_persona_natural;
ALTER TABLE IF EXISTS ONLY public.telefono_empresa DROP CONSTRAINT IF EXISTS pk_telefono_empresa;
ALTER TABLE IF EXISTS ONLY public.telefono DROP CONSTRAINT IF EXISTS pk_telefono;
ALTER TABLE IF EXISTS ONLY public.tarifa DROP CONSTRAINT IF EXISTS pk_tarifa;
ALTER TABLE IF EXISTS ONLY public.sexo DROP CONSTRAINT IF EXISTS pk_sexo;
ALTER TABLE IF EXISTS ONLY public.servicio DROP CONSTRAINT IF EXISTS pk_servicio;
ALTER TABLE IF EXISTS ONLY public.provincia DROP CONSTRAINT IF EXISTS pk_provincia;
ALTER TABLE IF EXISTS ONLY public.profesion DROP CONSTRAINT IF EXISTS pk_profesion;
ALTER TABLE IF EXISTS ONLY public.predio DROP CONSTRAINT IF EXISTS pk_predio;
ALTER TABLE IF EXISTS ONLY public.parroquia DROP CONSTRAINT IF EXISTS pk_parroquia;
ALTER TABLE IF EXISTS ONLY public.pais DROP CONSTRAINT IF EXISTS pk_pais;
ALTER TABLE IF EXISTS ONLY public.observacion_lectura DROP CONSTRAINT IF EXISTS pk_observacion_lectura;
ALTER TABLE IF EXISTS ONLY public.observacion_factura DROP CONSTRAINT IF EXISTS pk_observacion_factura;
ALTER TABLE IF EXISTS ONLY public.observacion_acometida DROP CONSTRAINT IF EXISTS pk_observacion_acometida;
ALTER TABLE IF EXISTS ONLY public.observacion DROP CONSTRAINT IF EXISTS pk_observacion;
ALTER TABLE IF EXISTS ONLY public.lectura_estado DROP CONSTRAINT IF EXISTS pk_lectura_estado;
ALTER TABLE IF EXISTS ONLY public.lectura DROP CONSTRAINT IF EXISTS pk_lectura;
ALTER TABLE IF EXISTS ONLY public.foto_lectura DROP CONSTRAINT IF EXISTS pk_foto_lectura;
ALTER TABLE IF EXISTS ONLY public.foto_acometida DROP CONSTRAINT IF EXISTS pk_foto_acometida;
ALTER TABLE IF EXISTS ONLY public.forma_pago DROP CONSTRAINT IF EXISTS pk_forma_pago;
ALTER TABLE IF EXISTS ONLY public.factura DROP CONSTRAINT IF EXISTS pk_factura;
ALTER TABLE IF EXISTS ONLY public.estado_pago DROP CONSTRAINT IF EXISTS pk_estado_pago;
ALTER TABLE IF EXISTS ONLY public.estado_civil DROP CONSTRAINT IF EXISTS pk_estado_civil;
ALTER TABLE IF EXISTS ONLY public.empresa DROP CONSTRAINT IF EXISTS pk_empresa;
ALTER TABLE IF EXISTS ONLY public.direccion DROP CONSTRAINT IF EXISTS pk_direccion;
ALTER TABLE IF EXISTS ONLY public.correo_persona_natural DROP CONSTRAINT IF EXISTS pk_correo_persona_natural;
ALTER TABLE IF EXISTS ONLY public.correo_empresa DROP CONSTRAINT IF EXISTS pk_correo_empresa;
ALTER TABLE IF EXISTS ONLY public.correo_electronico DROP CONSTRAINT IF EXISTS pk_correo_electronico;
ALTER TABLE IF EXISTS ONLY public.cliente_persona_natural DROP CONSTRAINT IF EXISTS pk_cliente_persona_natural;
ALTER TABLE IF EXISTS ONLY public.cliente DROP CONSTRAINT IF EXISTS pk_cliente;
ALTER TABLE IF EXISTS ONLY public.ciudadano DROP CONSTRAINT IF EXISTS pk_ciudadano;
ALTER TABLE IF EXISTS ONLY public.categoria DROP CONSTRAINT IF EXISTS pk_categoria;
ALTER TABLE IF EXISTS ONLY public.canton DROP CONSTRAINT IF EXISTS pk_canton;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS pk_acometida;
ALTER TABLE IF EXISTS ONLY public.permisos DROP CONSTRAINT IF EXISTS permisos_pkey;
ALTER TABLE IF EXISTS ONLY public.permisos DROP CONSTRAINT IF EXISTS permisos_nombre_key;
ALTER TABLE IF EXISTS ONLY public.permiso_categoria DROP CONSTRAINT IF EXISTS permiso_categoria_pkey;
ALTER TABLE IF EXISTS ONLY public.permiso_categoria DROP CONSTRAINT IF EXISTS permiso_categoria_nombre_key;
ALTER TABLE IF EXISTS ONLY public.lectura_estado DROP CONSTRAINT IF EXISTS lectura_estado_codigo_key;
ALTER TABLE IF EXISTS ONLY public.historial_estados_acometida DROP CONSTRAINT IF EXISTS historial_estados_acometida_pkey;
ALTER TABLE IF EXISTS ONLY public.estado_empleado DROP CONSTRAINT IF EXISTS estado_empleado_pkey;
ALTER TABLE IF EXISTS ONLY public.estado_empleado DROP CONSTRAINT IF EXISTS estado_empleado_codigo_key;
ALTER TABLE IF EXISTS ONLY public.estado_cliente_usuario DROP CONSTRAINT IF EXISTS estado_cliente_usuario_pkey;
ALTER TABLE IF EXISTS ONLY public.estado_cliente_usuario DROP CONSTRAINT IF EXISTS estado_cliente_usuario_codigo_key;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_usuario_id_key;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_pkey;
ALTER TABLE IF EXISTS ONLY public.empleados DROP CONSTRAINT IF EXISTS empleados_cedula_key;
ALTER TABLE IF EXISTS ONLY public.empleado_zona DROP CONSTRAINT IF EXISTS empleado_zona_pkey;
ALTER TABLE IF EXISTS ONLY public.consumo_promedio DROP CONSTRAINT IF EXISTS consumo_promedio_pkey;
ALTER TABLE IF EXISTS ONLY public.componentes_fijos DROP CONSTRAINT IF EXISTS componentes_fijos_pkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_pkey;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_email_key;
ALTER TABLE IF EXISTS ONLY public.cliente_usuario DROP CONSTRAINT IF EXISTS cliente_usuario_cliente_id_key;
ALTER TABLE IF EXISTS ONLY public.claves_sql2000 DROP CONSTRAINT IF EXISTS claves_sql2000_pkey;
ALTER TABLE IF EXISTS ONLY public.categoria DROP CONSTRAINT IF EXISTS categoria_nombre_key;
ALTER TABLE IF EXISTS ONLY public.cat_estados_acometida DROP CONSTRAINT IF EXISTS cat_estados_acometida_pkey;
ALTER TABLE IF EXISTS ONLY public.cat_estados_acometida DROP CONSTRAINT IF EXISTS cat_estados_acometida_nombre_key;
ALTER TABLE IF EXISTS ONLY public.cargo DROP CONSTRAINT IF EXISTS cargo_pkey;
ALTER TABLE IF EXISTS ONLY public.cargo DROP CONSTRAINT IF EXISTS cargo_nombre_key;
ALTER TABLE IF EXISTS ONLY public.auditoria_lectura_sector DROP CONSTRAINT IF EXISTS auditoria_lectura_sector_pkey;
ALTER TABLE IF EXISTS ONLY public.acometida DROP CONSTRAINT IF EXISTS acometida_clave_catastral_key;
ALTER TABLE IF EXISTS ONLY audit.usuario_refresh_tokens DROP CONSTRAINT IF EXISTS usuario_refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY audit.tabla_config DROP CONSTRAINT IF EXISTS tabla_config_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_default DROP CONSTRAINT IF EXISTS sesion_default_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_2026_07 DROP CONSTRAINT IF EXISTS sesion_2026_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_2026_06 DROP CONSTRAINT IF EXISTS sesion_2026_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_2026_05 DROP CONSTRAINT IF EXISTS sesion_2026_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion_2026_04 DROP CONSTRAINT IF EXISTS sesion_2026_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.sesion DROP CONSTRAINT IF EXISTS sesion_pkey;
ALTER TABLE IF EXISTS ONLY audit.regla_alerta DROP CONSTRAINT IF EXISTS regla_alerta_pkey;
ALTER TABLE IF EXISTS ONLY audit.regla_alerta DROP CONSTRAINT IF EXISTS regla_alerta_codigo_key;
ALTER TABLE IF EXISTS ONLY audit.registro_default DROP CONSTRAINT IF EXISTS registro_default_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_12 DROP CONSTRAINT IF EXISTS registro_2027_12_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_11 DROP CONSTRAINT IF EXISTS registro_2027_11_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_10 DROP CONSTRAINT IF EXISTS registro_2027_10_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_09 DROP CONSTRAINT IF EXISTS registro_2027_09_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_08 DROP CONSTRAINT IF EXISTS registro_2027_08_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_07 DROP CONSTRAINT IF EXISTS registro_2027_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_06 DROP CONSTRAINT IF EXISTS registro_2027_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_05 DROP CONSTRAINT IF EXISTS registro_2027_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_04 DROP CONSTRAINT IF EXISTS registro_2027_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_03 DROP CONSTRAINT IF EXISTS registro_2027_03_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_02 DROP CONSTRAINT IF EXISTS registro_2027_02_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2027_01 DROP CONSTRAINT IF EXISTS registro_2027_01_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_12 DROP CONSTRAINT IF EXISTS registro_2026_12_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_11 DROP CONSTRAINT IF EXISTS registro_2026_11_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_10 DROP CONSTRAINT IF EXISTS registro_2026_10_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_09 DROP CONSTRAINT IF EXISTS registro_2026_09_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_08 DROP CONSTRAINT IF EXISTS registro_2026_08_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_07 DROP CONSTRAINT IF EXISTS registro_2026_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_06 DROP CONSTRAINT IF EXISTS registro_2026_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_05 DROP CONSTRAINT IF EXISTS registro_2026_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_04 DROP CONSTRAINT IF EXISTS registro_2026_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_03 DROP CONSTRAINT IF EXISTS registro_2026_03_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_02 DROP CONSTRAINT IF EXISTS registro_2026_02_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2026_01 DROP CONSTRAINT IF EXISTS registro_2026_01_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_12 DROP CONSTRAINT IF EXISTS registro_2025_12_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_11 DROP CONSTRAINT IF EXISTS registro_2025_11_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_10 DROP CONSTRAINT IF EXISTS registro_2025_10_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_09 DROP CONSTRAINT IF EXISTS registro_2025_09_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_08 DROP CONSTRAINT IF EXISTS registro_2025_08_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_07 DROP CONSTRAINT IF EXISTS registro_2025_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_06 DROP CONSTRAINT IF EXISTS registro_2025_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_05 DROP CONSTRAINT IF EXISTS registro_2025_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_04 DROP CONSTRAINT IF EXISTS registro_2025_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_03 DROP CONSTRAINT IF EXISTS registro_2025_03_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_02 DROP CONSTRAINT IF EXISTS registro_2025_02_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2025_01 DROP CONSTRAINT IF EXISTS registro_2025_01_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_12 DROP CONSTRAINT IF EXISTS registro_2024_12_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_11 DROP CONSTRAINT IF EXISTS registro_2024_11_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_10 DROP CONSTRAINT IF EXISTS registro_2024_10_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_09 DROP CONSTRAINT IF EXISTS registro_2024_09_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_08 DROP CONSTRAINT IF EXISTS registro_2024_08_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_07 DROP CONSTRAINT IF EXISTS registro_2024_07_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_06 DROP CONSTRAINT IF EXISTS registro_2024_06_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_05 DROP CONSTRAINT IF EXISTS registro_2024_05_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_04 DROP CONSTRAINT IF EXISTS registro_2024_04_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_03 DROP CONSTRAINT IF EXISTS registro_2024_03_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_02 DROP CONSTRAINT IF EXISTS registro_2024_02_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro_2024_01 DROP CONSTRAINT IF EXISTS registro_2024_01_pkey;
ALTER TABLE IF EXISTS ONLY audit.registro DROP CONSTRAINT IF EXISTS registro_pkey;
ALTER TABLE IF EXISTS ONLY audit.alerta DROP CONSTRAINT IF EXISTS alerta_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud DROP CONSTRAINT IF EXISTS solicitud_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.solicitud_orden_trabajo DROP CONSTRAINT IF EXISTS solicitud_orden_trabajo_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_numero_cuenta_key;
ALTER TABLE IF EXISTS ONLY acometidas.registro_catastral DROP CONSTRAINT IF EXISTS registro_catastral_id_solicitud_key;
ALTER TABLE IF EXISTS ONLY acometidas.notificacion DROP CONSTRAINT IF EXISTS notificacion_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.inventario_medidor DROP CONSTRAINT IF EXISTS inventario_medidor_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.inventario_medidor DROP CONSTRAINT IF EXISTS inventario_medidor_numero_serie_key;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.informe_inspeccion DROP CONSTRAINT IF EXISTS informe_inspeccion_id_orden_trabajo_key;
ALTER TABLE IF EXISTS ONLY acometidas.historial_estado DROP CONSTRAINT IF EXISTS historial_estado_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_numero_factura_key;
ALTER TABLE IF EXISTS ONLY acometidas.factura_inspeccion DROP CONSTRAINT IF EXISTS factura_inspeccion_id_solicitud_key;
ALTER TABLE IF EXISTS ONLY acometidas.documento_adjunto DROP CONSTRAINT IF EXISTS documento_adjunto_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_numero_contrato_key;
ALTER TABLE IF EXISTS ONLY acometidas.contrato_servicio DROP CONSTRAINT IF EXISTS contrato_servicio_id_solicitud_key;
ALTER TABLE IF EXISTS ONLY acometidas.catalogo_tipo_documento DROP CONSTRAINT IF EXISTS catalogo_tipo_documento_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.catalogo_tipo_documento DROP CONSTRAINT IF EXISTS catalogo_tipo_documento_codigo_key;
ALTER TABLE IF EXISTS ONLY acometidas.catalogo_concepto_factura DROP CONSTRAINT IF EXISTS catalogo_concepto_factura_pkey;
ALTER TABLE IF EXISTS ONLY acometidas.catalogo_concepto_factura DROP CONSTRAINT IF EXISTS catalogo_concepto_factura_codigo_key;
ALTER TABLE IF EXISTS work_orders.tipo_trabajo ALTER COLUMN id_tipo_trabajo DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.rol_trabajador ALTER COLUMN id_rol DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.prioridad_orden_trabajo ALTER COLUMN id_prioridad DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.observaciones_orden_trabajo ALTER COLUMN id_observacion DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.historial_estado_orden_trabajo ALTER COLUMN id_historial DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.estado_orden_trabajo ALTER COLUMN id_estado DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.detalle_tipo_trabajo ALTER COLUMN id_detalle_tipo_trabajo DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.detalle_prioridad ALTER COLUMN id_detalle_prioridad DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.detalle_orden_trabajo_material ALTER COLUMN id_detalle_orden_trabajo_material DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.departamento_trabajo ALTER COLUMN id_departamento DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.asignacion_orden_trabajo_trabajador ALTER COLUMN id_asignacion DROP DEFAULT;
ALTER TABLE IF EXISTS work_orders.adjuntos_orden_trabajo ALTER COLUMN id_adjunto DROP DEFAULT;
ALTER TABLE IF EXISTS public.zona ALTER COLUMN zona_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.usuario_roles ALTER COLUMN usuario_rol_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.usuario_permisos ALTER COLUMN usuario_permiso_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.usuario_lectura ALTER COLUMN usuario_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.usuario_factura ALTER COLUMN usuario_factura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.titulo_dato ALTER COLUMN titulo_dato_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_titulo_dato ALTER COLUMN tipo_titulo_dato_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_telefono ALTER COLUMN tipo_telefono_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_relacion_familiar ALTER COLUMN tipo_relacion_familiar_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_predio ALTER COLUMN tipo_predio_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_novedad_lectura ALTER COLUMN tipo_novedad_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_estado_lectura ALTER COLUMN tipo_estado_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tipo_contrato ALTER COLUMN tipo_contrato_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.telefono_persona_natural ALTER COLUMN telefono_persona_natural_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.telefono_empresa ALTER COLUMN telefono_empresa_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.telefono ALTER COLUMN telefono_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tarifa ALTER COLUMN tarifa_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.siguiente_lectura ALTER COLUMN siguiente_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sexo ALTER COLUMN sexo_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.servicio ALTER COLUMN servicio_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.seguimiento_lectura ALTER COLUMN seguimiento_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN rol_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.rol_permisos ALTER COLUMN rol_permiso_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.respaldo_acometidas_2026 ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.refresh_tokens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.rangos_variables ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.qrcode ALTER COLUMN qrcode_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.profesion ALTER COLUMN profesion_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.permisos ALTER COLUMN permiso_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.permiso_categoria ALTER COLUMN categoria_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.observacion_lectura ALTER COLUMN observacion_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.observacion_factura ALTER COLUMN observacion_factura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.observacion_acometida ALTER COLUMN observacion_acometida_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.observacion ALTER COLUMN observacion_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.lectura_estado ALTER COLUMN lectura_estado_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.lectura ALTER COLUMN lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.historial_estados_acometida ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.foto_lectura ALTER COLUMN foto_lectura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.foto_acometida ALTER COLUMN foto_acometida_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.forma_pago ALTER COLUMN forma_pago_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.factura ALTER COLUMN factura_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.estado_pago ALTER COLUMN estado_pago_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.estado_empleado ALTER COLUMN estado_empleado_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.estado_cliente_usuario ALTER COLUMN estado_cliente_usuario_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.estado_civil ALTER COLUMN estado_civil_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.direccion ALTER COLUMN direccion_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.correo_persona_natural ALTER COLUMN correo_persona_natural_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.correo_empresa ALTER COLUMN correo_empresa_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.correo_electronico ALTER COLUMN correo_electronico_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.componentes_fijos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cliente_persona_natural ALTER COLUMN cliente_persona_natural_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.claves_sql2000 ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categoria ALTER COLUMN categoria_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cargo ALTER COLUMN cargo_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.auditoria_lectura_sector ALTER COLUMN audit_id DROP DEFAULT;
ALTER TABLE IF EXISTS audit.regla_alerta ALTER COLUMN regla_id DROP DEFAULT;
ALTER TABLE IF EXISTS acometidas.catalogo_tipo_documento ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS acometidas.catalogo_concepto_factura ALTER COLUMN id DROP DEFAULT;
DROP VIEW IF EXISTS work_orders.view_work_orders_by_client;
DROP VIEW IF EXISTS work_orders.view_work_order_statistics;
DROP VIEW IF EXISTS work_orders.view_work_order_observations;
DROP VIEW IF EXISTS work_orders.view_work_order_materials;
DROP VIEW IF EXISTS work_orders.view_work_order_key_statistics;
DROP VIEW IF EXISTS work_orders.view_work_order_attachments;
DROP VIEW IF EXISTS work_orders.view_work_order_assignments;
DROP VIEW IF EXISTS work_orders.view_orden_trabajo_detalle;
DROP VIEW IF EXISTS work_orders.view_historical_work_orders;
DROP VIEW IF EXISTS work_orders.view_dashboard_ordenes_trabajo;
DROP VIEW IF EXISTS work_orders.view_all_work_orders_full_details;
DROP VIEW IF EXISTS work_orders.view_active_work_orders;
DROP SEQUENCE IF EXISTS work_orders.tipo_trabajo_id_tipo_trabajo_seq;
DROP TABLE IF EXISTS work_orders.tipo_trabajo;
DROP SEQUENCE IF EXISTS work_orders.rol_trabajador_id_rol_seq;
DROP TABLE IF EXISTS work_orders.rol_trabajador;
DROP SEQUENCE IF EXISTS work_orders.prioridad_orden_trabajo_id_prioridad_seq;
DROP TABLE IF EXISTS work_orders.prioridad_orden_trabajo;
DROP TABLE IF EXISTS work_orders.orden_trabajo;
DROP SEQUENCE IF EXISTS work_orders.orden_trabajo_seq;
DROP SEQUENCE IF EXISTS work_orders.observaciones_orden_trabajo_id_observacion_seq;
DROP TABLE IF EXISTS work_orders.observaciones_orden_trabajo;
DROP SEQUENCE IF EXISTS work_orders.historial_estado_orden_trabajo_id_historial_seq;
DROP TABLE IF EXISTS work_orders.historial_estado_orden_trabajo;
DROP SEQUENCE IF EXISTS work_orders.estado_orden_trabajo_id_estado_seq;
DROP TABLE IF EXISTS work_orders.estado_orden_trabajo;
DROP SEQUENCE IF EXISTS work_orders.detalle_tipo_trabajo_id_detalle_tipo_trabajo_seq;
DROP TABLE IF EXISTS work_orders.detalle_tipo_trabajo;
DROP SEQUENCE IF EXISTS work_orders.detalle_prioridad_id_detalle_prioridad_seq;
DROP TABLE IF EXISTS work_orders.detalle_prioridad;
DROP SEQUENCE IF EXISTS work_orders.detalle_orden_trabajo_materia_id_detalle_orden_trabajo_mate_seq;
DROP TABLE IF EXISTS work_orders.detalle_orden_trabajo_material;
DROP SEQUENCE IF EXISTS work_orders.departamento_trabajo_id_departamento_seq;
DROP TABLE IF EXISTS work_orders.departamento_trabajo;
DROP TABLE IF EXISTS work_orders.auditoria_inv_inventario;
DROP SEQUENCE IF EXISTS work_orders.asignacion_orden_trabajo_trabajador_id_asignacion_seq;
DROP TABLE IF EXISTS work_orders.asignacion_orden_trabajo_trabajador;
DROP SEQUENCE IF EXISTS work_orders.adjuntos_orden_trabajo_id_adjunto_seq;
DROP TABLE IF EXISTS work_orders.adjuntos_orden_trabajo;
DROP SEQUENCE IF EXISTS public.zona_zona_id_seq;
DROP TABLE IF EXISTS public.zona;
DROP VIEW IF EXISTS public.vw_historial_lectura;
DROP VIEW IF EXISTS public.vw_calendario_lecturas;
DROP VIEW IF EXISTS public.vw_calendario_completo;
DROP VIEW IF EXISTS public.vw_avance_actualizacion_acometidas;
DROP SEQUENCE IF EXISTS public.usuario_roles_usuario_rol_id_seq;
DROP TABLE IF EXISTS public.usuario_roles;
DROP SEQUENCE IF EXISTS public.usuario_permisos_usuario_permiso_id_seq;
DROP TABLE IF EXISTS public.usuario_permisos;
DROP SEQUENCE IF EXISTS public.usuario_lectura_usuario_lectura_id_seq;
DROP TABLE IF EXISTS public.usuario_lectura;
DROP SEQUENCE IF EXISTS public.usuario_factura_usuario_factura_id_seq;
DROP TABLE IF EXISTS public.usuario_factura;
DROP SEQUENCE IF EXISTS public.titulo_dato_titulo_dato_id_seq;
DROP TABLE IF EXISTS public.titulo_dato;
DROP SEQUENCE IF EXISTS public.tipo_titulo_dato_tipo_titulo_dato_id_seq;
DROP TABLE IF EXISTS public.tipo_titulo_dato;
DROP SEQUENCE IF EXISTS public.tipo_telefono_tipo_telefono_id_seq;
DROP TABLE IF EXISTS public.tipo_telefono;
DROP SEQUENCE IF EXISTS public.tipo_relacion_familiar_tipo_relacion_familiar_id_seq;
DROP TABLE IF EXISTS public.tipo_relacion_familiar;
DROP SEQUENCE IF EXISTS public.tipo_predio_tipo_predio_id_seq;
DROP TABLE IF EXISTS public.tipo_predio;
DROP TABLE IF EXISTS public.tipo_parroquia;
DROP SEQUENCE IF EXISTS public.tipo_novedad_lectura_tipo_novedad_lectura_id_seq;
DROP TABLE IF EXISTS public.tipo_novedad_lectura;
DROP TABLE IF EXISTS public.tipo_identificacion;
DROP SEQUENCE IF EXISTS public.tipo_estado_lectura_tipo_estado_lectura_id_seq;
DROP TABLE IF EXISTS public.tipo_estado_lectura;
DROP SEQUENCE IF EXISTS public.tipo_contrato_tipo_contrato_id_seq;
DROP TABLE IF EXISTS public.tipo_contrato;
DROP TABLE IF EXISTS public.temp_correo_electronico;
DROP TABLE IF EXISTS public.temp_acometida_update;
DROP SEQUENCE IF EXISTS public.telefono_telefono_id_seq;
DROP SEQUENCE IF EXISTS public.telefono_persona_natural_telefono_persona_natural_id_seq;
DROP TABLE IF EXISTS public.telefono_persona_natural;
DROP SEQUENCE IF EXISTS public.telefono_empresa_telefono_empresa_id_seq;
DROP TABLE IF EXISTS public.telefono_empresa;
DROP SEQUENCE IF EXISTS public.tarifa_tarifa_id_seq;
DROP TABLE IF EXISTS public.tarifa;
DROP SEQUENCE IF EXISTS public.siguiente_lectura_siguiente_lectura_id_seq;
DROP TABLE IF EXISTS public.siguiente_lectura;
DROP SEQUENCE IF EXISTS public.sexo_sexo_id_seq;
DROP TABLE IF EXISTS public.sexo;
DROP SEQUENCE IF EXISTS public.servicio_servicio_id_seq;
DROP TABLE IF EXISTS public.servicio;
DROP SEQUENCE IF EXISTS public.seguimiento_lectura_seguimiento_lectura_id_seq;
DROP TABLE IF EXISTS public.seguimiento_lectura;
DROP SEQUENCE IF EXISTS public.roles_rol_id_seq;
DROP TABLE IF EXISTS public.roles;
DROP SEQUENCE IF EXISTS public.rol_permisos_rol_permiso_id_seq;
DROP TABLE IF EXISTS public.rol_permisos;
DROP SEQUENCE IF EXISTS public.respaldo_acometidas_2026_id_seq;
DROP TABLE IF EXISTS public.respaldo_acometidas_2026;
DROP SEQUENCE IF EXISTS public.refresh_tokens_id_seq;
DROP TABLE IF EXISTS public.refresh_tokens;
DROP SEQUENCE IF EXISTS public.rangos_variables_id_seq;
DROP TABLE IF EXISTS public.rangos_variables;
DROP SEQUENCE IF EXISTS public.qrcode_qrcode_id_seq;
DROP TABLE IF EXISTS public.qrcode;
DROP TABLE IF EXISTS public.provincia;
DROP SEQUENCE IF EXISTS public.profesion_profesion_id_seq;
DROP TABLE IF EXISTS public.profesion;
DROP TABLE IF EXISTS public.predio;
DROP SEQUENCE IF EXISTS public.permisos_permiso_id_seq;
DROP TABLE IF EXISTS public.permisos;
DROP SEQUENCE IF EXISTS public.permiso_categoria_categoria_id_seq;
DROP TABLE IF EXISTS public.permiso_categoria;
DROP TABLE IF EXISTS public.parroquia;
DROP TABLE IF EXISTS public.pais;
DROP SEQUENCE IF EXISTS public.observacion_observacion_id_seq;
DROP SEQUENCE IF EXISTS public.observacion_lectura_observacion_lectura_id_seq;
DROP TABLE IF EXISTS public.observacion_lectura;
DROP SEQUENCE IF EXISTS public.observacion_factura_observacion_factura_id_seq;
DROP TABLE IF EXISTS public.observacion_factura;
DROP SEQUENCE IF EXISTS public.observacion_acometida_observacion_acometida_id_seq;
DROP TABLE IF EXISTS public.observacion_acometida;
DROP TABLE IF EXISTS public.observacion;
DROP SEQUENCE IF EXISTS public.lectura_lectura_id_seq;
DROP SEQUENCE IF EXISTS public.lectura_estado_lectura_estado_id_seq;
DROP TABLE IF EXISTS public.lectura_estado;
DROP TABLE IF EXISTS public.lectura;
DROP SEQUENCE IF EXISTS public.historial_estados_acometida_id_seq;
DROP TABLE IF EXISTS public.historial_estados_acometida;
DROP SEQUENCE IF EXISTS public.foto_lectura_foto_lectura_id_seq;
DROP TABLE IF EXISTS public.foto_lectura;
DROP SEQUENCE IF EXISTS public.foto_acometida_foto_acometida_id_seq;
DROP TABLE IF EXISTS public.foto_acometida;
DROP SEQUENCE IF EXISTS public.forma_pago_forma_pago_id_seq;
DROP TABLE IF EXISTS public.forma_pago;
DROP SEQUENCE IF EXISTS public.factura_factura_id_seq;
DROP TABLE IF EXISTS public.factura;
DROP SEQUENCE IF EXISTS public.estado_pago_estado_pago_id_seq;
DROP TABLE IF EXISTS public.estado_pago;
DROP SEQUENCE IF EXISTS public.estado_empleado_estado_empleado_id_seq;
DROP TABLE IF EXISTS public.estado_empleado;
DROP SEQUENCE IF EXISTS public.estado_cliente_usuario_estado_cliente_usuario_id_seq;
DROP TABLE IF EXISTS public.estado_cliente_usuario;
DROP SEQUENCE IF EXISTS public.estado_civil_estado_civil_id_seq;
DROP TABLE IF EXISTS public.estado_civil;
DROP TABLE IF EXISTS public.empresa;
DROP TABLE IF EXISTS public.empleados;
DROP TABLE IF EXISTS public.empleado_zona;
DROP SEQUENCE IF EXISTS public.direccion_direccion_id_seq;
DROP TABLE IF EXISTS public.direccion;
DROP SEQUENCE IF EXISTS public.correo_persona_natural_correo_persona_natural_id_seq;
DROP TABLE IF EXISTS public.correo_persona_natural;
DROP SEQUENCE IF EXISTS public.correo_empresa_correo_empresa_id_seq;
DROP TABLE IF EXISTS public.correo_empresa;
DROP SEQUENCE IF EXISTS public.correo_electronico_correo_electronico_id_seq;
DROP TABLE IF EXISTS public.consumo_promedio;
DROP SEQUENCE IF EXISTS public.componentes_fijos_id_seq;
DROP TABLE IF EXISTS public.componentes_fijos;
DROP TABLE IF EXISTS public.cliente_usuario;
DROP SEQUENCE IF EXISTS public.cliente_persona_natural_cliente_persona_natural_id_seq;
DROP TABLE IF EXISTS public.cliente_persona_natural;
DROP VIEW IF EXISTS public.cliente_contacto;
DROP TABLE IF EXISTS public.telefono;
DROP TABLE IF EXISTS public.correo_electronico;
DROP TABLE IF EXISTS public.cliente;
DROP SEQUENCE IF EXISTS public.claves_sql2000_id_seq;
DROP TABLE IF EXISTS public.claves_sql2000;
DROP TABLE IF EXISTS public.ciudadano;
DROP SEQUENCE IF EXISTS public.categoria_categoria_id_seq;
DROP TABLE IF EXISTS public.categoria;
DROP TABLE IF EXISTS public.cat_estados_acometida;
DROP SEQUENCE IF EXISTS public.cargo_cargo_id_seq;
DROP TABLE IF EXISTS public.cargo;
DROP TABLE IF EXISTS public.canton;
DROP SEQUENCE IF EXISTS public.auditoria_lectura_sector_audit_id_seq;
DROP TABLE IF EXISTS public.auditoria_lectura_sector;
DROP TABLE IF EXISTS public.acometida;
DROP VIEW IF EXISTS audit.vw_resumen_diario;
DROP VIEW IF EXISTS audit.vw_resumen_accesos;
DROP VIEW IF EXISTS audit.vw_permisos;
DROP VIEW IF EXISTS audit.vw_historial_fila;
DROP VIEW IF EXISTS audit.vw_estado_triggers;
DROP VIEW IF EXISTS audit.vw_estadisticas_generales;
DROP VIEW IF EXISTS audit.vw_config_resumen;
DROP VIEW IF EXISTS audit.vw_cambios_sensibles;
DROP VIEW IF EXISTS audit.vw_cambios_recientes;
DROP VIEW IF EXISTS audit.vw_alertas_activas;
DROP VIEW IF EXISTS audit.vw_actividad_usuario;
DROP VIEW IF EXISTS audit.vw_accesos_recientes;
DROP TABLE IF EXISTS audit.usuario_refresh_tokens;
DROP TABLE IF EXISTS audit.tabla_config;
DROP TABLE IF EXISTS audit.sesion_default;
DROP TABLE IF EXISTS audit.sesion_2026_07;
DROP TABLE IF EXISTS audit.sesion_2026_06;
DROP TABLE IF EXISTS audit.sesion_2026_05;
DROP TABLE IF EXISTS audit.sesion_2026_04;
DROP TABLE IF EXISTS audit.sesion;
DROP SEQUENCE IF EXISTS audit.regla_alerta_regla_id_seq;
DROP TABLE IF EXISTS audit.regla_alerta;
DROP TABLE IF EXISTS audit.registro_default;
DROP TABLE IF EXISTS audit.registro_2027_12;
DROP TABLE IF EXISTS audit.registro_2027_11;
DROP TABLE IF EXISTS audit.registro_2027_10;
DROP TABLE IF EXISTS audit.registro_2027_09;
DROP TABLE IF EXISTS audit.registro_2027_08;
DROP TABLE IF EXISTS audit.registro_2027_07;
DROP TABLE IF EXISTS audit.registro_2027_06;
DROP TABLE IF EXISTS audit.registro_2027_05;
DROP TABLE IF EXISTS audit.registro_2027_04;
DROP TABLE IF EXISTS audit.registro_2027_03;
DROP TABLE IF EXISTS audit.registro_2027_02;
DROP TABLE IF EXISTS audit.registro_2027_01;
DROP TABLE IF EXISTS audit.registro_2026_12;
DROP TABLE IF EXISTS audit.registro_2026_11;
DROP TABLE IF EXISTS audit.registro_2026_10;
DROP TABLE IF EXISTS audit.registro_2026_09;
DROP TABLE IF EXISTS audit.registro_2026_08;
DROP TABLE IF EXISTS audit.registro_2026_07;
DROP TABLE IF EXISTS audit.registro_2026_06;
DROP TABLE IF EXISTS audit.registro_2026_05;
DROP TABLE IF EXISTS audit.registro_2026_04;
DROP TABLE IF EXISTS audit.registro_2026_03;
DROP TABLE IF EXISTS audit.registro_2026_02;
DROP TABLE IF EXISTS audit.registro_2026_01;
DROP TABLE IF EXISTS audit.registro_2025_12;
DROP TABLE IF EXISTS audit.registro_2025_11;
DROP TABLE IF EXISTS audit.registro_2025_10;
DROP TABLE IF EXISTS audit.registro_2025_09;
DROP TABLE IF EXISTS audit.registro_2025_08;
DROP TABLE IF EXISTS audit.registro_2025_07;
DROP TABLE IF EXISTS audit.registro_2025_06;
DROP TABLE IF EXISTS audit.registro_2025_05;
DROP TABLE IF EXISTS audit.registro_2025_04;
DROP TABLE IF EXISTS audit.registro_2025_03;
DROP TABLE IF EXISTS audit.registro_2025_02;
DROP TABLE IF EXISTS audit.registro_2025_01;
DROP TABLE IF EXISTS audit.registro_2024_12;
DROP TABLE IF EXISTS audit.registro_2024_11;
DROP TABLE IF EXISTS audit.registro_2024_10;
DROP TABLE IF EXISTS audit.registro_2024_09;
DROP TABLE IF EXISTS audit.registro_2024_08;
DROP TABLE IF EXISTS audit.registro_2024_07;
DROP TABLE IF EXISTS audit.registro_2024_06;
DROP TABLE IF EXISTS audit.registro_2024_05;
DROP TABLE IF EXISTS audit.registro_2024_04;
DROP TABLE IF EXISTS audit.registro_2024_03;
DROP TABLE IF EXISTS audit.registro_2024_02;
DROP TABLE IF EXISTS audit.registro_2024_01;
DROP TABLE IF EXISTS audit.registro;
DROP TABLE IF EXISTS audit.alerta;
DROP VIEW IF EXISTS acometidas.v_panel_solicitudes;
DROP TABLE IF EXISTS public.usuarios;
DROP TABLE IF EXISTS acometidas.solicitud_orden_trabajo;
DROP TABLE IF EXISTS acometidas.solicitud;
DROP TABLE IF EXISTS acometidas.registro_catastral;
DROP TABLE IF EXISTS acometidas.notificacion;
DROP TABLE IF EXISTS acometidas.inventario_medidor;
DROP TABLE IF EXISTS acometidas.informe_inspeccion;
DROP TABLE IF EXISTS acometidas.historial_estado;
DROP TABLE IF EXISTS acometidas.factura_inspeccion;
DROP TABLE IF EXISTS acometidas.documento_adjunto;
DROP TABLE IF EXISTS acometidas.contrato_servicio;
DROP SEQUENCE IF EXISTS acometidas.catalogo_tipo_documento_id_seq;
DROP TABLE IF EXISTS acometidas.catalogo_tipo_documento;
DROP SEQUENCE IF EXISTS acometidas.catalogo_concepto_factura_id_seq;
DROP TABLE IF EXISTS acometidas.catalogo_concepto_factura;
DROP FUNCTION IF EXISTS work_orders.set_updated_at();
DROP FUNCTION IF EXISTS work_orders.registrar_cambio_estado();
DROP FUNCTION IF EXISTS work_orders.generar_codigo_orden();
DROP FUNCTION IF EXISTS public.update_timestamp();
DROP FUNCTION IF EXISTS public.update_empleados_timestamp();
DROP FUNCTION IF EXISTS public.update_consumo_promedio();
DROP FUNCTION IF EXISTS public.update_cliente_usuario_timestamp();
DROP FUNCTION IF EXISTS public.trg_update_is_locked_out();
DROP PROCEDURE IF EXISTS public.pr_generar_auditoria_mensual(IN p_fecha date);
DROP FUNCTION IF EXISTS public.fn_update_meter_reading_initial();
DROP FUNCTION IF EXISTS public.fn_sync_lectura_auditoria();
DROP FUNCTION IF EXISTS public.fn_mes_lectura(ts timestamp without time zone);
DROP FUNCTION IF EXISTS public.fn_mes_lectura(p_fecha date);
DROP FUNCTION IF EXISTS public.fn_insert_initial_reading_full();
DROP FUNCTION IF EXISTS public.fn_insert_cambio_medidor_reading();
DROP FUNCTION IF EXISTS public.fn_inicializar_siguiente_lectura(p_acometida_id character varying, p_fecha_base date);
DROP FUNCTION IF EXISTS public.fn_control_siguiente_lectura_mensual();
DROP FUNCTION IF EXISTS public.fn_block_duplicate_lectura();
DROP FUNCTION IF EXISTS public.fn_auto_cierre_auditoria();
DROP FUNCTION IF EXISTS public.fn_auditar_cambio_estado();
DROP FUNCTION IF EXISTS public.fn_actualizar_estado_activo();
DROP FUNCTION IF EXISTS public.actualizar_updated_at();
DROP FUNCTION IF EXISTS audit.fn_set_contexto(p_usuario_id text, p_usuario_nom text, p_ip_address text, p_sesion_id text, p_app_nombre text);
DROP FUNCTION IF EXISTS audit.fn_resolver_alerta(p_alerta_id bigint, p_usuario_id uuid, p_nota text);
DROP FUNCTION IF EXISTS audit.fn_registrar_acceso(p_usuario_id uuid, p_usuario_name text, p_evento text, p_ip inet, p_user_agent text, p_motivo text, p_metadata jsonb);
DROP FUNCTION IF EXISTS audit.fn_registrar();
DROP FUNCTION IF EXISTS audit.fn_reactivar_tabla(p_tabla text);
DROP FUNCTION IF EXISTS audit.fn_pausar_tabla(p_tabla text);
DROP FUNCTION IF EXISTS audit.fn_obtener_pk(p_schema text, p_tabla text, p_fila jsonb);
DROP FUNCTION IF EXISTS audit.fn_limpiar_tokens_invalidos();
DROP FUNCTION IF EXISTS audit.fn_limpiar_particiones_antiguas(p_dry_run boolean);
DROP FUNCTION IF EXISTS audit.fn_generar_reporte_retencion();
DROP FUNCTION IF EXISTS audit.fn_evaluar_alertas();
DROP FUNCTION IF EXISTS audit.fn_estadisticas_particiones();
DROP FUNCTION IF EXISTS audit.fn_enmascarar_jsonb(p_datos jsonb, p_enmascarar text[], p_excluir text[]);
DROP FUNCTION IF EXISTS audit.fn_crear_proximas_particiones(p_meses integer);
DROP FUNCTION IF EXISTS audit.fn_crear_particion_sesion(p_fecha date);
DROP FUNCTION IF EXISTS audit.fn_crear_particion_mes(p_fecha date);
DROP FUNCTION IF EXISTS audit.fn_contexto_sesion();
DROP FUNCTION IF EXISTS audit.fn_config_updated_at();
DROP FUNCTION IF EXISTS audit.fn_aplicar_triggers();
DROP FUNCTION IF EXISTS acometidas.fn_validar_transicion(p_estado_actual acometidas.estado_solicitud, p_nuevo_estado acometidas.estado_solicitud);
DROP FUNCTION IF EXISTS acometidas.fn_set_updated_at();
DROP FUNCTION IF EXISTS acometidas.fn_enforce_state_machine();
DROP FUNCTION IF EXISTS acometidas.fn_cambiar_estado_solicitud(p_id_solicitud uuid, p_nuevo_estado acometidas.estado_solicitud, p_id_usuario uuid, p_comentario text, p_datos_extra jsonb);
DROP TYPE IF EXISTS work_orders.prioridad_nivel;
DROP TYPE IF EXISTS work_orders.estado_nombre;
DROP TYPE IF EXISTS audit.audit_severidad;
DROP TYPE IF EXISTS audit.audit_operacion;
DROP TYPE IF EXISTS audit.audit_nivel;
DROP TYPE IF EXISTS acometidas.uso_predio;
DROP TYPE IF EXISTS acometidas.tipo_persona;
DROP TYPE IF EXISTS acometidas.tipo_orden;
DROP TYPE IF EXISTS acometidas.tipo_acometida;
DROP TYPE IF EXISTS acometidas.resultado_inspeccion;
DROP TYPE IF EXISTS acometidas.estado_validacion_doc;
DROP TYPE IF EXISTS acometidas.estado_solicitud;
DROP TYPE IF EXISTS acometidas.estado_pago;
DROP TYPE IF EXISTS acometidas.estado_orden;
DROP TYPE IF EXISTS acometidas.estado_firma;
DROP TYPE IF EXISTS acometidas.canal_notificacion;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS postgis_topology;
DROP EXTENSION IF EXISTS postgis_raster;
DROP EXTENSION IF EXISTS postgis;
DROP EXTENSION IF EXISTS pgcrypto;
DROP SCHEMA IF EXISTS work_orders;
DROP SCHEMA IF EXISTS topology;
DROP SCHEMA IF EXISTS audit;
DROP SCHEMA IF EXISTS acometidas;
--
-- TOC entry 11 (class 2615 OID 184285)
-- Name: acometidas; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA acometidas;


--
-- TOC entry 12 (class 2615 OID 184286)
-- Name: audit; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA audit;


--
-- TOC entry 10020 (class 0 OID 0)
-- Dependencies: 12
-- Name: SCHEMA audit; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA audit IS 'Schema de auditoría enterprise-grade para SIGEPAA. Registra INSERT/UPDATE/DELETE de todas las tablas críticas con diff JSONB, contexto de sesión, alertas automáticas y retención por particionado mensual.';


--
-- TOC entry 14 (class 2615 OID 184287)
-- Name: topology; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA topology;


--
-- TOC entry 10021 (class 0 OID 0)
-- Dependencies: 14
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- TOC entry 13 (class 2615 OID 184288)
-- Name: work_orders; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA work_orders;


--
-- TOC entry 2 (class 3079 OID 184289)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 10022 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 3 (class 3079 OID 184327)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 10023 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 4 (class 3079 OID 185409)
-- Name: postgis_raster; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_raster WITH SCHEMA public;


--
-- TOC entry 10024 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION postgis_raster; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis_raster IS 'PostGIS raster types and functions';


--
-- TOC entry 5 (class 3079 OID 185970)
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- TOC entry 10025 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


--
-- TOC entry 6 (class 3079 OID 186157)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 10026 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 2647 (class 1247 OID 186169)
-- Name: canal_notificacion; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.canal_notificacion AS ENUM (
    'EMAIL',
    'SMS',
    'SISTEMA',
    'PRESENCIAL'
);


--
-- TOC entry 2650 (class 1247 OID 186178)
-- Name: estado_firma; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.estado_firma AS ENUM (
    'PENDIENTE',
    'FIRMADO_USUARIO',
    'FIRMADO_EPAA',
    'COMPLETO'
);


--
-- TOC entry 2653 (class 1247 OID 186188)
-- Name: estado_orden; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.estado_orden AS ENUM (
    'PENDIENTE',
    'ASIGNADA',
    'EN_PROCESO',
    'COMPLETADA',
    'FALLIDA',
    'ANULADA'
);


--
-- TOC entry 2656 (class 1247 OID 186202)
-- Name: estado_pago; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.estado_pago AS ENUM (
    'PENDIENTE',
    'PAGADO',
    'ANULADO'
);


--
-- TOC entry 2659 (class 1247 OID 186210)
-- Name: estado_solicitud; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.estado_solicitud AS ENUM (
    'DRAFT',
    'DOCS_SUBMITTED',
    'DOCS_REJECTED',
    'DOCS_APPROVED',
    'FACTURA_INSPECCION_EMITIDA',
    'PAGO_PENDIENTE',
    'PAGO_CONFIRMADO',
    'ORDEN_INSPECCION_EMITIDA',
    'INSPECCION_EN_PROCESO',
    'INFORME_EN_REVISION',
    'RECHAZADA_TECNICA',
    'INFORME_APROBADO',
    'CONTRATO_GENERADO',
    'CONTRATO_FIRMADO',
    'OT_INSTALACION_EMITIDA',
    'INSTALACION_EN_PROCESO',
    'INSTALACION_FALLIDA',
    'INSTALACION_COMPLETADA',
    'REGISTRO_CATASTRAL_PENDIENTE',
    'SUMINISTRO_ACTIVO',
    'ANULADA'
);


--
-- TOC entry 2662 (class 1247 OID 186254)
-- Name: estado_validacion_doc; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.estado_validacion_doc AS ENUM (
    'PENDIENTE',
    'VALIDO',
    'INVALIDO'
);


--
-- TOC entry 2665 (class 1247 OID 186262)
-- Name: resultado_inspeccion; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.resultado_inspeccion AS ENUM (
    'FACTIBLE',
    'NO_FACTIBLE',
    'CONDICIONADA'
);


--
-- TOC entry 2668 (class 1247 OID 186270)
-- Name: tipo_acometida; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.tipo_acometida AS ENUM (
    'AGUA_POTABLE',
    'ALCANTARILLADO',
    'AMBAS'
);


--
-- TOC entry 2671 (class 1247 OID 186278)
-- Name: tipo_orden; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.tipo_orden AS ENUM (
    'INSPECCION',
    'INSTALACION'
);


--
-- TOC entry 2674 (class 1247 OID 186284)
-- Name: tipo_persona; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.tipo_persona AS ENUM (
    'NATURAL',
    'JURIDICA'
);


--
-- TOC entry 2677 (class 1247 OID 186290)
-- Name: uso_predio; Type: TYPE; Schema: acometidas; Owner: -
--

CREATE TYPE acometidas.uso_predio AS ENUM (
    'RESIDENCIAL',
    'COMERCIAL',
    'INDUSTRIAL',
    'PUBLICO'
);


--
-- TOC entry 2680 (class 1247 OID 186300)
-- Name: audit_nivel; Type: TYPE; Schema: audit; Owner: -
--

CREATE TYPE audit.audit_nivel AS ENUM (
    'MINIMAL',
    'STANDARD',
    'FULL'
);


--
-- TOC entry 2683 (class 1247 OID 186308)
-- Name: audit_operacion; Type: TYPE; Schema: audit; Owner: -
--

CREATE TYPE audit.audit_operacion AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE'
);


--
-- TOC entry 2686 (class 1247 OID 186318)
-- Name: audit_severidad; Type: TYPE; Schema: audit; Owner: -
--

CREATE TYPE audit.audit_severidad AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);


--
-- TOC entry 2689 (class 1247 OID 186328)
-- Name: estado_nombre; Type: TYPE; Schema: work_orders; Owner: -
--

CREATE TYPE work_orders.estado_nombre AS ENUM (
    'Pendiente',
    'Asignada',
    'Reasignada',
    'En Progreso',
    'En Espera',
    'Reanudada',
    'Completada',
    'Cancelada'
);


--
-- TOC entry 2692 (class 1247 OID 186346)
-- Name: prioridad_nivel; Type: TYPE; Schema: work_orders; Owner: -
--

CREATE TYPE work_orders.prioridad_nivel AS ENUM (
    'Baja',
    'Media',
    'Alta',
    'Urgente',
    'Emergencia'
);


--
-- TOC entry 590 (class 1255 OID 186357)
-- Name: fn_cambiar_estado_solicitud(uuid, acometidas.estado_solicitud, uuid, text, jsonb); Type: FUNCTION; Schema: acometidas; Owner: -
--

CREATE FUNCTION acometidas.fn_cambiar_estado_solicitud(p_id_solicitud uuid, p_nuevo_estado acometidas.estado_solicitud, p_id_usuario uuid, p_comentario text DEFAULT NULL::text, p_datos_extra jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_estado_anterior acometidas.estado_solicitud;
BEGIN
    -- Obtener estado actual con bloqueo para evitar condiciones de carrera
    SELECT estado INTO v_estado_anterior
    FROM acometidas.solicitud
    WHERE id_solicitud = p_id_solicitud
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitud % no encontrada', p_id_solicitud;
    END IF;

    -- Actualizar estado en la solicitud
    UPDATE acometidas.solicitud
    SET estado = p_nuevo_estado
    WHERE id_solicitud = p_id_solicitud;

    -- Registrar en el historial
    INSERT INTO acometidas.historial_estado (
        id_solicitud, estado_anterior, estado_nuevo,
        id_usuario_accion, comentario, datos_extra
    ) VALUES (
        p_id_solicitud, v_estado_anterior, p_nuevo_estado,
        p_id_usuario, p_comentario, p_datos_extra
    );
END;
$$;


--
-- TOC entry 1363 (class 1255 OID 186358)
-- Name: fn_enforce_state_machine(); Type: FUNCTION; Schema: acometidas; Owner: -
--

CREATE FUNCTION acometidas.fn_enforce_state_machine() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF OLD.estado <> NEW.estado THEN
        IF NOT acometidas.fn_validar_transicion(OLD.estado, NEW.estado) THEN
            RAISE EXCEPTION 'Transición de estado inválida: % → %', OLD.estado, NEW.estado;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;


--
-- TOC entry 1477 (class 1255 OID 186359)
-- Name: fn_set_updated_at(); Type: FUNCTION; Schema: acometidas; Owner: -
--

CREATE FUNCTION acometidas.fn_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- TOC entry 1805 (class 1255 OID 186360)
-- Name: fn_validar_transicion(acometidas.estado_solicitud, acometidas.estado_solicitud); Type: FUNCTION; Schema: acometidas; Owner: -
--

CREATE FUNCTION acometidas.fn_validar_transicion(p_estado_actual acometidas.estado_solicitud, p_nuevo_estado acometidas.estado_solicitud) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN CASE
        WHEN p_estado_actual = 'DRAFT'                        AND p_nuevo_estado IN ('DOCS_SUBMITTED', 'ANULADA')                    THEN TRUE
        WHEN p_estado_actual = 'DOCS_SUBMITTED'               AND p_nuevo_estado IN ('DOCS_APPROVED', 'DOCS_REJECTED', 'ANULADA')    THEN TRUE
        WHEN p_estado_actual = 'DOCS_REJECTED'                AND p_nuevo_estado IN ('DOCS_SUBMITTED', 'ANULADA')                    THEN TRUE
        WHEN p_estado_actual = 'DOCS_APPROVED'                AND p_nuevo_estado IN ('FACTURA_INSPECCION_EMITIDA', 'ANULADA')        THEN TRUE
        WHEN p_estado_actual = 'FACTURA_INSPECCION_EMITIDA'   AND p_nuevo_estado IN ('PAGO_PENDIENTE', 'ANULADA')                    THEN TRUE
        WHEN p_estado_actual = 'PAGO_PENDIENTE'               AND p_nuevo_estado IN ('PAGO_CONFIRMADO', 'ANULADA')                   THEN TRUE
        WHEN p_estado_actual = 'PAGO_CONFIRMADO'              AND p_nuevo_estado IN ('ORDEN_INSPECCION_EMITIDA', 'ANULADA')          THEN TRUE
        WHEN p_estado_actual = 'ORDEN_INSPECCION_EMITIDA'     AND p_nuevo_estado IN ('INSPECCION_EN_PROCESO', 'ANULADA')             THEN TRUE
        WHEN p_estado_actual = 'INSPECCION_EN_PROCESO'        AND p_nuevo_estado IN ('INFORME_EN_REVISION')                          THEN TRUE
        WHEN p_estado_actual = 'INFORME_EN_REVISION'          AND p_nuevo_estado IN ('INFORME_APROBADO', 'RECHAZADA_TECNICA')        THEN TRUE
        WHEN p_estado_actual = 'INFORME_APROBADO'             AND p_nuevo_estado IN ('CONTRATO_GENERADO')                            THEN TRUE
        WHEN p_estado_actual = 'CONTRATO_GENERADO'            AND p_nuevo_estado IN ('CONTRATO_FIRMADO', 'ANULADA')                  THEN TRUE
        WHEN p_estado_actual = 'CONTRATO_FIRMADO'             AND p_nuevo_estado IN ('OT_INSTALACION_EMITIDA')                       THEN TRUE
        WHEN p_estado_actual = 'OT_INSTALACION_EMITIDA'       AND p_nuevo_estado IN ('INSTALACION_EN_PROCESO')                       THEN TRUE
        WHEN p_estado_actual = 'INSTALACION_EN_PROCESO'       AND p_nuevo_estado IN ('INSTALACION_COMPLETADA', 'INSTALACION_FALLIDA') THEN TRUE
        WHEN p_estado_actual = 'INSTALACION_FALLIDA'          AND p_nuevo_estado IN ('OT_INSTALACION_EMITIDA', 'ANULADA')            THEN TRUE
        WHEN p_estado_actual = 'INSTALACION_COMPLETADA'       AND p_nuevo_estado IN ('REGISTRO_CATASTRAL_PENDIENTE')                  THEN TRUE
        WHEN p_estado_actual = 'REGISTRO_CATASTRAL_PENDIENTE' AND p_nuevo_estado IN ('SUMINISTRO_ACTIVO')                            THEN TRUE
        ELSE FALSE
    END;
END;
$$;


--
-- TOC entry 1794 (class 1255 OID 186361)
-- Name: fn_aplicar_triggers(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_aplicar_triggers() RETURNS TABLE(tabla text, accion text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    r        RECORD;
    v_existe BOOLEAN;
BEGIN
    FOR r IN
        SELECT tc.tabla_nombre
        FROM audit.tabla_config tc
        WHERE tc.activo = TRUE
        ORDER BY tc.tabla_nombre
    LOOP
        -- Verificar que la tabla existe en public
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name   = r.tabla_nombre
        ) INTO v_existe;

        IF NOT v_existe THEN
            tabla  := r.tabla_nombre;
            accion := 'OMITIDA — tabla no encontrada en schema public';
            RETURN NEXT;
            CONTINUE;
        END IF;

        -- Eliminar trigger previo si existía (idempotente)
        EXECUTE FORMAT(
            'DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I',
            r.tabla_nombre, r.tabla_nombre
        );

        -- Crear trigger AFTER INSERT OR UPDATE OR DELETE
        EXECUTE FORMAT(
            'CREATE TRIGGER trg_audit_%I '
            'AFTER INSERT OR UPDATE OR DELETE ON public.%I '
            'FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar()',
            r.tabla_nombre, r.tabla_nombre
        );

        tabla  := r.tabla_nombre;
        accion := 'TRIGGER CREADO: trg_audit_' || r.tabla_nombre;
        RETURN NEXT;
    END LOOP;
END;
$$;


--
-- TOC entry 10027 (class 0 OID 0)
-- Dependencies: 1794
-- Name: FUNCTION fn_aplicar_triggers(); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_aplicar_triggers() IS 'Crea o recrea los triggers de auditoría en todas las tablas activas de audit.tabla_config. Es idempotente y seguro de ejecutar múltiples veces. Uso: SELECT * FROM audit.fn_aplicar_triggers();';


--
-- TOC entry 905 (class 1255 OID 186362)
-- Name: fn_config_updated_at(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_config_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;


--
-- TOC entry 1601 (class 1255 OID 186363)
-- Name: fn_contexto_sesion(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_contexto_sesion() RETURNS TABLE(usuario_id uuid, usuario_nom text, ip_address inet, sesion_id text, app_nombre text)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY SELECT
        NULLIF(current_setting('app.usuario_id',  TRUE), '')::UUID,
        NULLIF(current_setting('app.usuario_nom',  TRUE), ''),
        NULLIF(current_setting('app.ip_address',  TRUE), '')::INET,
        NULLIF(current_setting('app.sesion_id',   TRUE), ''),
        COALESCE(NULLIF(current_setting('app.nombre', TRUE), ''), 'SIGEPAA');
EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT NULL::UUID, NULL::TEXT, NULL::INET, NULL::TEXT, 'SIGEPAA'::TEXT;
END;
$$;


--
-- TOC entry 10028 (class 0 OID 0)
-- Dependencies: 1601
-- Name: FUNCTION fn_contexto_sesion(); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_contexto_sesion() IS 'Lee las variables de sesión inyectadas por la aplicación (SET LOCAL app.*). Retorna el contexto del usuario actual para inclusión en registros de auditoría.';


--
-- TOC entry 1332 (class 1255 OID 186364)
-- Name: fn_crear_particion_mes(date); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_crear_particion_mes(p_fecha date DEFAULT CURRENT_DATE) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    v_inicio  DATE;
    v_fin     DATE;
    v_nombre  TEXT;
    v_sql     TEXT;
BEGIN
    v_inicio := DATE_TRUNC('month', p_fecha)::DATE;
    v_fin    := (v_inicio + INTERVAL '1 month')::DATE;
    v_nombre := 'audit.registro_' || TO_CHAR(v_inicio, 'YYYY_MM');

    -- Verificar si ya existe
    IF EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'audit'
          AND tablename  = 'registro_' || TO_CHAR(v_inicio, 'YYYY_MM')
    ) THEN
        RETURN 'YA EXISTE: ' || v_nombre;
    END IF;

    v_sql := FORMAT(
        'CREATE TABLE %s PARTITION OF audit.registro '
        'FOR VALUES FROM (%L) TO (%L)',
        v_nombre, v_inicio, v_fin
    );
    EXECUTE v_sql;

    RETURN 'CREADA: ' || v_nombre || ' (' || v_inicio || ' → ' || v_fin || ')';
EXCEPTION WHEN OTHERS THEN
    RETURN 'ERROR: ' || SQLERRM;
END;
$$;


--
-- TOC entry 10029 (class 0 OID 0)
-- Dependencies: 1332
-- Name: FUNCTION fn_crear_particion_mes(p_fecha date); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_crear_particion_mes(p_fecha date) IS 'Crea la partición mensual de audit.registro para la fecha dada. Llamar mensualmente (ej: primer día del mes anterior al siguiente). Ejemplo: SELECT audit.fn_crear_particion_mes(''2028-01-01'');';


--
-- TOC entry 1394 (class 1255 OID 186365)
-- Name: fn_crear_particion_sesion(date); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_crear_particion_sesion(p_fecha date DEFAULT CURRENT_DATE) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    v_inicio  DATE;
    v_fin     DATE;
    v_nombre  TEXT;
    v_sql     TEXT;
BEGIN
    v_inicio := DATE_TRUNC('month', p_fecha)::DATE;
    v_fin    := (v_inicio + INTERVAL '1 month')::DATE;
    v_nombre := 'audit.sesion_' || TO_CHAR(v_inicio, 'YYYY_MM');

    -- Verificar si ya existe
    IF EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'audit'
          AND tablename  = 'sesion_' || TO_CHAR(v_inicio, 'YYYY_MM')
    ) THEN
        RETURN 'YA EXISTE: ' || v_nombre;
    END IF;

    v_sql := FORMAT(
        'CREATE TABLE %s PARTITION OF audit.sesion '
        'FOR VALUES FROM (%L) TO (%L)',
        v_nombre, v_inicio, v_fin
    );
    EXECUTE v_sql;

    RETURN 'CREADA: ' || v_nombre || ' (' || v_inicio || ' → ' || v_fin || ')';
EXCEPTION WHEN OTHERS THEN
    RETURN 'ERROR: ' || SQLERRM;
END;
$$;


--
-- TOC entry 736 (class 1255 OID 186366)
-- Name: fn_crear_proximas_particiones(integer); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_crear_proximas_particiones(p_meses integer DEFAULT 3) RETURNS SETOF text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    i INTEGER;
BEGIN
    FOR i IN 0..p_meses LOOP
        RETURN NEXT audit.fn_crear_particion_mes(
            (DATE_TRUNC('month', CURRENT_DATE) + (i || ' months')::INTERVAL)::DATE
        );
    END LOOP;
END;
$$;


--
-- TOC entry 10030 (class 0 OID 0)
-- Dependencies: 736
-- Name: FUNCTION fn_crear_proximas_particiones(p_meses integer); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_crear_proximas_particiones(p_meses integer) IS 'Crea las próximas N particiones mensuales desde el mes actual. Recomendado: ejecutar mensualmente con pg_cron o cron del SO. Ejemplo: SELECT audit.fn_crear_proximas_particiones(3);';


--
-- TOC entry 1220 (class 1255 OID 186367)
-- Name: fn_enmascarar_jsonb(jsonb, text[], text[]); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_enmascarar_jsonb(p_datos jsonb, p_enmascarar text[], p_excluir text[]) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER
    AS $$
DECLARE
    v_resultado JSONB := '{}';
    v_clave     TEXT;
    v_valor     JSONB;
BEGIN
    IF p_datos IS NULL THEN RETURN NULL; END IF;

    FOR v_clave, v_valor IN SELECT key, value FROM jsonb_each(p_datos) LOOP

        -- Omitir completamente si está en la lista de excluidos
        IF p_excluir IS NOT NULL AND v_clave = ANY(p_excluir) THEN
            CONTINUE;
        END IF;

        -- Enmascarar con SHA-256 si está en la lista de sensibles
        IF p_enmascarar IS NOT NULL AND v_clave = ANY(p_enmascarar) THEN
            IF v_valor IS NULL OR v_valor = 'null'::JSONB THEN
                v_resultado := v_resultado || jsonb_build_object(v_clave, NULL);
            ELSE
                v_resultado := v_resultado || jsonb_build_object(
                    v_clave,
                    '[SHA256:' || encode(
                        digest(v_valor #>> '{}', 'sha256'),
                        'hex'
                    ) || ']'
                );
            END IF;
            CONTINUE;
        END IF;

        -- Columna normal: incluir tal cual
        v_resultado := v_resultado || jsonb_build_object(v_clave, v_valor);
    END LOOP;

    RETURN v_resultado;
END;
$$;


--
-- TOC entry 10031 (class 0 OID 0)
-- Dependencies: 1220
-- Name: FUNCTION fn_enmascarar_jsonb(p_datos jsonb, p_enmascarar text[], p_excluir text[]); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_enmascarar_jsonb(p_datos jsonb, p_enmascarar text[], p_excluir text[]) IS 'Procesa JSONB de una fila para auditoría: excluye columnas no deseadas y enmascara valores sensibles con SHA-256 (no reversible). Requiere extensión pgcrypto.';


--
-- TOC entry 843 (class 1255 OID 186368)
-- Name: fn_estadisticas_particiones(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_estadisticas_particiones() RETURNS TABLE(particion text, fecha_desde date, fecha_hasta date, total_filas bigint, tamanio_bytes bigint, tamanio_pretty text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $_$
BEGIN
    RETURN QUERY
    SELECT
        (schemaname || '.' || tablename)::TEXT,
        TO_DATE(
            REPLACE(REPLACE(tablename, 'registro_', ''), '_', '-') || '-01',
            'YYYY-MM-DD'
        ) AS fecha_desde,
        (TO_DATE(
            REPLACE(REPLACE(tablename, 'registro_', ''), '_', '-') || '-01',
            'YYYY-MM-DD'
        ) + INTERVAL '1 month - 1 day')::DATE AS fecha_hasta,
        (SELECT reltuples::BIGINT FROM pg_class WHERE relname = tablename)::BIGINT AS total_filas,
        pg_relation_size(schemaname || '.' || tablename)::BIGINT,
        pg_size_pretty(pg_relation_size(schemaname || '.' || tablename))
    FROM pg_tables
    WHERE schemaname = 'audit'
      AND tablename ~ '^registro_\d{4}_\d{2}$'
    ORDER BY tablename;
END;
$_$;


--
-- TOC entry 10032 (class 0 OID 0)
-- Dependencies: 843
-- Name: FUNCTION fn_estadisticas_particiones(); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_estadisticas_particiones() IS 'Muestra el tamaño y número de filas de cada partición de audit.registro. Uso: SELECT * FROM audit.fn_estadisticas_particiones();';


--
-- TOC entry 1594 (class 1255 OID 186369)
-- Name: fn_evaluar_alertas(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_evaluar_alertas() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $_$
DECLARE
    v_regla         audit.regla_alerta%ROWTYPE;
    v_alertas_new   INTEGER := 0;
    v_desde         TIMESTAMPTZ;
    v_ya_existe     BOOLEAN;
    v_registros     RECORD;
BEGIN
    -- Iterar sobre reglas activas
    FOR v_regla IN
        SELECT * FROM audit.regla_alerta WHERE activa = TRUE ORDER BY severidad DESC
    LOOP
        v_desde := NOW() - (v_regla.ventana_minutos || ' minutes')::INTERVAL;

        -- Evitar duplicar alertas: verificar si ya existe una alerta del mismo
        -- tipo y usuario en la última ventana
        FOR v_registros IN
            EXECUTE FORMAT(
                $q$
                SELECT
                    usuario_id,
                    usuario_nombre,
                    %L AS tabla_nombre,
                    COUNT(*) AS total,
                    ARRAY_AGG(audit_id ORDER BY audit_id) AS audit_ids
                FROM audit.registro
                WHERE audit_timestamp > %L
                  %s
                  %s
                GROUP BY usuario_id, usuario_nombre
                HAVING COUNT(*) >= %s
                $q$,
                COALESCE(v_regla.tabla_objetivo, 'MULTIPLES'),
                v_desde,
                CASE WHEN v_regla.tabla_objetivo IS NOT NULL
                     THEN 'AND tabla_nombre = ' || quote_literal(v_regla.tabla_objetivo)
                     ELSE '' END,
                CASE WHEN v_regla.operacion IS NOT NULL
                     THEN 'AND operacion::TEXT = ' || quote_literal(v_regla.operacion)
                     ELSE '' END,
                COALESCE(v_regla.umbral_count, 1)
            )
        LOOP
            -- Verificar si ya existe alerta reciente para este usuario+tipo
            SELECT EXISTS (
                SELECT 1 FROM audit.alerta
                WHERE tipo_alerta = v_regla.codigo
                  AND usuario_id  = v_registros.usuario_id
                  AND created_at  > v_desde
                  AND resuelta    = FALSE
            ) INTO v_ya_existe;

            IF NOT v_ya_existe THEN
                INSERT INTO audit.alerta (
                    tipo_alerta, severidad, descripcion,
                    tabla_nombre, usuario_id, usuario_nombre,
                    audit_ids, metadata
                ) VALUES (
                    v_regla.codigo,
                    v_regla.severidad,
                    FORMAT(
                        '[%s] %s — Usuario: %s | Eventos: %s | Ventana: %s min',
                        v_regla.codigo,
                        v_regla.descripcion,
                        COALESCE(v_registros.usuario_nombre, v_registros.usuario_id::TEXT, 'DESCONOCIDO'),
                        v_registros.total,
                        v_regla.ventana_minutos
                    ),
                    v_registros.tabla_nombre,
                    v_registros.usuario_id,
                    v_registros.usuario_nombre,
                    v_registros.audit_ids,
                    jsonb_build_object(
                        'regla_id',        v_regla.regla_id,
                        'umbral_count',    v_regla.umbral_count,
                        'ventana_minutos', v_regla.ventana_minutos,
                        'total_eventos',   v_registros.total
                    )
                );
                v_alertas_new := v_alertas_new + 1;
            END IF;
        END LOOP;
    END LOOP;

    RETURN v_alertas_new;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '[AUDIT] Error en fn_evaluar_alertas: %', SQLERRM;
    RETURN -1;
END;
$_$;


--
-- TOC entry 10033 (class 0 OID 0)
-- Dependencies: 1594
-- Name: FUNCTION fn_evaluar_alertas(); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_evaluar_alertas() IS 'Evalúa todas las reglas de alertas activas y genera registros en audit.alerta. Retorna el número de nuevas alertas generadas. Ejecutar periódicamente: SELECT audit.fn_evaluar_alertas(); Recomendado: cada 5 minutos via pg_cron.';


--
-- TOC entry 680 (class 1255 OID 186370)
-- Name: fn_generar_reporte_retencion(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_generar_reporte_retencion() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_report JSONB;
BEGIN
    SELECT jsonb_build_object(
        'generado_en', NOW(),
        'politica_default_dias', 2190,
        'politica_default_descripcion', '6 años (cumplimiento tributario Ecuador)',
        'tablas_configuradas', (SELECT COUNT(*) FROM audit.tabla_config WHERE activo = TRUE),
        'total_eventos', (SELECT COUNT(*) FROM audit.registro),
        'primera_fecha', (SELECT MIN(audit_timestamp) FROM audit.registro),
        'ultima_fecha',  (SELECT MAX(audit_timestamp) FROM audit.registro),
        'particiones', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'nombre', schemaname || '.' || tablename,
                    'tamanio', pg_size_pretty(pg_relation_size(schemaname || '.' || tablename))
                )
                ORDER BY tablename
            )
            FROM pg_tables
            WHERE schemaname = 'audit' AND tablename LIKE 'registro_%'
        ),
        'tam_total_schema', pg_size_pretty(
            (SELECT SUM(pg_total_relation_size(schemaname || '.' || tablename))
             FROM pg_tables WHERE schemaname = 'audit')::BIGINT
        )
    ) INTO v_report;

    RETURN v_report;
END;
$$;


--
-- TOC entry 10034 (class 0 OID 0)
-- Dependencies: 680
-- Name: FUNCTION fn_generar_reporte_retencion(); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_generar_reporte_retencion() IS 'Genera reporte JSONB de retención de datos para compliance. Uso: SELECT audit.fn_generar_reporte_retencion();';


--
-- TOC entry 1849 (class 1255 OID 186371)
-- Name: fn_limpiar_particiones_antiguas(boolean); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_limpiar_particiones_antiguas(p_dry_run boolean DEFAULT true) RETURNS TABLE(particion text, fecha_desde date, fecha_hasta date, accion text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $_$
DECLARE
    v_retener_min_dias  INTEGER;
    v_corte_fecha       DATE;
    v_particion_schema  TEXT;
    v_particion_nombre  TEXT;
    v_fecha_particion   DATE;
    v_pg_particion      RECORD;
BEGIN
    -- Obtener la menor política de retención configurada (el más restrictivo)
    SELECT COALESCE(MIN(retener_dias), 2190)  -- default: 6 años
    INTO v_retener_min_dias
    FROM audit.tabla_config
    WHERE activo = TRUE;

    v_corte_fecha := CURRENT_DATE - v_retener_min_dias;

    RAISE NOTICE '[AUDIT RETENCIÓN] Política: % días | Corte: % | Dry-run: %',
                 v_retener_min_dias, v_corte_fecha, p_dry_run;

    -- Identificar particiones candidatas para eliminación
    FOR v_pg_particion IN
        SELECT
            schemaname,
            tablename,
            -- Extraer fecha de nombre: registro_YYYY_MM → YYYY-MM-01
            TO_DATE(
                REPLACE(
                    REPLACE(tablename, 'registro_', ''),
                    '_', '-'
                ) || '-01',
                'YYYY-MM-DD'
            ) AS fecha_particion
        FROM pg_tables
        WHERE schemaname = 'audit'
          AND tablename  ~ '^registro_\d{4}_\d{2}$'
        ORDER BY tablename
    LOOP
        -- La partición cubre [fecha_particion, fecha_particion + 1 mes)
        -- Si su fecha FIN es anterior al corte, es candidata
        IF (v_pg_particion.fecha_particion + INTERVAL '1 month')::DATE <= v_corte_fecha THEN

            particion   := v_pg_particion.schemaname || '.' || v_pg_particion.tablename;
            fecha_desde := v_pg_particion.fecha_particion;
            fecha_hasta := (v_pg_particion.fecha_particion + INTERVAL '1 month - 1 day')::DATE;

            IF p_dry_run THEN
                accion := 'DRY-RUN: se eliminaría ' || particion;
            ELSE
                EXECUTE 'DROP TABLE IF EXISTS ' || particion;
                accion := 'ELIMINADA: ' || particion;
                RAISE NOTICE '[AUDIT RETENCIÓN] %', accion;
            END IF;

            RETURN NEXT;
        END IF;
    END LOOP;

    IF p_dry_run THEN
        RAISE NOTICE '[AUDIT RETENCIÓN] Dry-run completado. Ejecutar con FALSE para eliminar.';
    ELSE
        RAISE NOTICE '[AUDIT RETENCIÓN] Limpieza completada.';
    END IF;
END;
$_$;


--
-- TOC entry 10035 (class 0 OID 0)
-- Dependencies: 1849
-- Name: FUNCTION fn_limpiar_particiones_antiguas(p_dry_run boolean); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_limpiar_particiones_antiguas(p_dry_run boolean) IS 'Elimina particiones mensuales de audit.registro que superaron el período de retención. Por defecto ejecuta en dry-run (no elimina). Uso: SELECT * FROM audit.fn_limpiar_particiones_antiguas(FALSE); -- para eliminar Recomendado: ejecutar mensualmente via pg_cron o cron del SO.';


--
-- TOC entry 1416 (class 1255 OID 186372)
-- Name: fn_limpiar_tokens_invalidos(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_limpiar_tokens_invalidos() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM audit.usuario_refresh_tokens
    WHERE expires_at < NOW() 
       OR (revoked = TRUE AND revoked_at < NOW() - INTERVAL '7 days');
END;
$$;


--
-- TOC entry 765 (class 1255 OID 186373)
-- Name: fn_obtener_pk(text, text, jsonb); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_obtener_pk(p_schema text, p_tabla text, p_fila jsonb) RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'audit', 'public', 'information_schema'
    AS $$
DECLARE
    v_pk_cols   TEXT[];
    v_pk_jsonb  JSONB := '{}';
    v_col       TEXT;
BEGIN
    -- Obtener columnas PK desde constraint del sistema
    SELECT ARRAY_AGG(kcu.column_name ORDER BY kcu.ordinal_position)
    INTO v_pk_cols
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema   = kcu.table_schema
        AND tc.table_name     = kcu.table_name
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_schema    = p_schema
      AND tc.table_name      = p_tabla;

    -- Fallback si no se encontró PK (tablas sin PK explícita)
    IF v_pk_cols IS NULL OR array_length(v_pk_cols, 1) = 0 THEN
        RETURN jsonb_build_object('_no_pk', 'true');
    END IF;

    -- Extraer valores del JSONB de la fila
    FOREACH v_col IN ARRAY v_pk_cols LOOP
        v_pk_jsonb := v_pk_jsonb || jsonb_build_object(v_col, p_fila -> v_col);
    END LOOP;

    RETURN v_pk_jsonb;
END;
$$;


--
-- TOC entry 10036 (class 0 OID 0)
-- Dependencies: 765
-- Name: FUNCTION fn_obtener_pk(p_schema text, p_tabla text, p_fila jsonb); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_obtener_pk(p_schema text, p_tabla text, p_fila jsonb) IS 'Extrae los valores de la clave primaria de una fila serializada como JSONB. Consulta information_schema para descubrir las columnas PK dinámicamente. Soporta PKs compuestas.';


--
-- TOC entry 973 (class 1255 OID 186374)
-- Name: fn_pausar_tabla(text); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_pausar_tabla(p_tabla text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
BEGIN
    -- Verificar que existe la config
    IF NOT EXISTS (SELECT 1 FROM audit.tabla_config WHERE tabla_nombre = p_tabla) THEN
        RAISE EXCEPTION 'Tabla % no está en audit.tabla_config', p_tabla;
    END IF;

    UPDATE audit.tabla_config SET activo = FALSE, updated_at = NOW()
    WHERE tabla_nombre = p_tabla;

    EXECUTE FORMAT(
        'DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I',
        p_tabla, p_tabla
    );

    RAISE NOTICE '[AUDIT] Auditoría PAUSADA para tabla: %', p_tabla;
END;
$$;


--
-- TOC entry 1129 (class 1255 OID 186375)
-- Name: fn_reactivar_tabla(text); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_reactivar_tabla(p_tabla text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM audit.tabla_config WHERE tabla_nombre = p_tabla) THEN
        RAISE EXCEPTION 'Tabla % no está en audit.tabla_config', p_tabla;
    END IF;

    UPDATE audit.tabla_config SET activo = TRUE, updated_at = NOW()
    WHERE tabla_nombre = p_tabla;

    EXECUTE FORMAT(
        'DROP TRIGGER IF EXISTS trg_audit_%I ON public.%I; '
        'CREATE TRIGGER trg_audit_%I '
        'AFTER INSERT OR UPDATE OR DELETE ON public.%I '
        'FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar()',
        p_tabla, p_tabla, p_tabla, p_tabla
    );

    RAISE NOTICE '[AUDIT] Auditoría REACTIVADA para tabla: %', p_tabla;
END;
$$;


--
-- TOC entry 1857 (class 1255 OID 186376)
-- Name: fn_registrar(); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_registrar() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'audit', 'public'
    AS $$
DECLARE
    -- Configuración de la tabla
    v_config            audit.tabla_config%ROWTYPE;

    -- Contexto de sesión
    v_usuario_id        UUID;
    v_usuario_nom       TEXT;
    v_ip                INET;
    v_sesion            TEXT;
    v_app               TEXT;

    -- Serialización de filas
    v_fila_old          JSONB;
    v_fila_new          JSONB;
    v_datos_antes       JSONB;
    v_datos_despues     JSONB;

    -- Diff columna a columna
    v_diff              JSONB    := '{}'::JSONB;
    v_campos            TEXT[]   := ARRAY[]::TEXT[];
    v_col               TEXT;
    v_val_antes         JSONB;
    v_val_despues       JSONB;

    -- PK
    v_pk                JSONB;

    -- Columnas sensibles de la config
    v_enmascarar        TEXT[];
    v_excluir           TEXT[];

    -- Marcas de tiempo para duracion
    v_inicio            TIMESTAMPTZ := CLOCK_TIMESTAMP();
BEGIN
    -- =========================================================================
    -- 1. Leer configuración de la tabla (si no está configurada, no auditar)
    -- =========================================================================
    SELECT * INTO v_config
    FROM audit.tabla_config
    WHERE tabla_nombre = TG_TABLE_NAME;

    -- Si no hay configuración o está desactivada → pasar sin auditar
    IF NOT FOUND OR NOT v_config.activo THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    -- Filtrar por operación habilitada
    IF TG_OP = 'INSERT' AND NOT v_config.auditar_insert THEN RETURN NEW; END IF;
    IF TG_OP = 'UPDATE' AND NOT v_config.auditar_update THEN RETURN NEW; END IF;
    IF TG_OP = 'DELETE' AND NOT v_config.auditar_delete THEN RETURN OLD; END IF;

    -- =========================================================================
    -- 2. Leer contexto de sesión inyectado por la aplicación
    -- =========================================================================
    BEGIN
        v_usuario_id  := NULLIF(current_setting('app.usuario_id',  TRUE), '')::UUID;
        v_usuario_nom := NULLIF(current_setting('app.usuario_nom',  TRUE), '');
        v_ip          := NULLIF(current_setting('app.ip_address',  TRUE), '')::INET;
        v_sesion      := NULLIF(current_setting('app.sesion_id',   TRUE), '');
        v_app         := COALESCE(NULLIF(current_setting('app.nombre', TRUE), ''), 'SIGEPAA');
    EXCEPTION WHEN OTHERS THEN
        -- No bloquear la transacción si falla la lectura del contexto
        v_usuario_id  := NULL;
        v_usuario_nom := NULL;
        v_ip          := NULL;
        v_sesion      := NULL;
        v_app         := 'SIGEPAA';
    END;

    -- =========================================================================
    -- 3. Preparar columnas sensibles
    -- =========================================================================
    v_enmascarar := COALESCE(v_config.columnas_enmascarar, ARRAY[]::TEXT[]);
    v_excluir    := COALESCE(v_config.columnas_excluidas,  ARRAY[]::TEXT[]);

    -- =========================================================================
    -- 4. Serializar filas OLD y NEW aplicando enmascaramiento
    -- =========================================================================
    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        v_fila_old    := row_to_json(OLD)::JSONB;
        v_datos_antes := audit.fn_enmascarar_jsonb(v_fila_old, v_enmascarar, v_excluir);
    END IF;

    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        v_fila_new    := row_to_json(NEW)::JSONB;
        v_datos_despues := audit.fn_enmascarar_jsonb(v_fila_new, v_enmascarar, v_excluir);
    END IF;

    -- =========================================================================
    -- 5. Calcular diff solo en UPDATE y solo en nivel STANDARD o FULL
    -- =========================================================================
    IF TG_OP = 'UPDATE' AND v_config.nivel != 'MINIMAL' THEN
        FOR v_col IN SELECT key FROM jsonb_each(v_datos_despues) LOOP
            v_val_antes   := v_datos_antes  -> v_col;
            v_val_despues := v_datos_despues -> v_col;

            IF v_val_antes IS DISTINCT FROM v_val_despues THEN
                v_campos := v_campos || v_col;
                v_diff   := v_diff || jsonb_build_object(
                    v_col,
                    jsonb_build_object('antes', v_val_antes, 'despues', v_val_despues)
                );
            END IF;
        END LOOP;

        -- Optimización: si nada cambió realmente (ej: UPDATE sin cambios reales),
        -- no registrar el evento para evitar ruido en la auditoría.
        IF array_length(v_campos, 1) IS NULL THEN
            RETURN NEW;
        END IF;
    END IF;

    -- =========================================================================
    -- 6. En nivel MINIMAL → no guardar filas completas, solo metadatos
    -- =========================================================================
    IF v_config.nivel = 'MINIMAL' THEN
        v_datos_antes   := NULL;
        v_datos_despues := NULL;
        v_diff          := '{}'::JSONB;
    END IF;

    -- =========================================================================
    -- 7. Obtener valor de la PK de la fila afectada
    -- =========================================================================
    v_pk := audit.fn_obtener_pk(
        TG_TABLE_SCHEMA,
        TG_TABLE_NAME,
        COALESCE(v_fila_new, v_fila_old)
    );

    -- =========================================================================
    -- 8. Insertar en audit.registro
    -- =========================================================================
    INSERT INTO audit.registro (
        audit_timestamp,
        -- Contexto de quién
        usuario_id, usuario_nombre, ip_address, sesion_id, app_nombre,
        -- Contexto de qué
        schema_nombre, tabla_nombre, operacion, pk_valor,
        -- Datos
        datos_antes, datos_despues, campos_cambiados, diff_jsonb,
        -- Métricas
        duracion_ms,
        query_hash
    ) VALUES (
        CLOCK_TIMESTAMP(),
        v_usuario_id, v_usuario_nom, v_ip, v_sesion, v_app,
        TG_TABLE_SCHEMA, TG_TABLE_NAME, TG_OP::audit.audit_operacion, v_pk,
        v_datos_antes, v_datos_despues, v_campos, v_diff,
        EXTRACT(EPOCH FROM (CLOCK_TIMESTAMP() - v_inicio)) * 1000,
        md5(current_query())
    );

    RETURN COALESCE(NEW, OLD);

EXCEPTION WHEN OTHERS THEN
    -- =========================================================================
    -- 9. Manejo de errores: NO bloquear la transacción de negocio
    --    por un fallo de auditoría. Solo registrar advertencia.
    -- =========================================================================
    RAISE WARNING '[AUDIT] Error en fn_registrar para tabla=% operacion=%: %',
                  TG_TABLE_NAME, TG_OP, SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- TOC entry 10037 (class 0 OID 0)
-- Dependencies: 1857
-- Name: FUNCTION fn_registrar(); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_registrar() IS 'Función trigger genérica AFTER INSERT/UPDATE/DELETE. Se aplica a todas las tablas configuradas en audit.tabla_config. SECURITY DEFINER: ejecuta con privilegios del propietario del schema. Nunca bloquea la transacción de negocio (errores son solo WARNING). Requiere: audit.fn_enmascarar_jsonb(), audit.fn_obtener_pk().';


--
-- TOC entry 1192 (class 1255 OID 186378)
-- Name: fn_registrar_acceso(uuid, text, text, inet, text, text, jsonb); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_registrar_acceso(p_usuario_id uuid, p_usuario_name text, p_evento text, p_ip inet, p_user_agent text, p_motivo text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO audit.sesion (
        usuario_id,
        usuario_nombre,
        evento,
        ip_address,
        user_agent,
        motivo_fallo,
        metadata
    ) VALUES (
        p_usuario_id,
        p_usuario_name,
        p_evento,
        p_ip,
        p_user_agent,
        p_motivo,
        p_metadata
    );
END;
$$;


--
-- TOC entry 1628 (class 1255 OID 186379)
-- Name: fn_resolver_alerta(bigint, uuid, text); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_resolver_alerta(p_alerta_id bigint, p_usuario_id uuid, p_nota text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    UPDATE audit.alerta
    SET resuelta       = TRUE,
        resuelta_por   = p_usuario_id,
        resuelta_at    = NOW(),
        resolucion_nota = p_nota
    WHERE alerta_id = p_alerta_id
      AND resuelta  = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Alerta % no encontrada o ya estaba resuelta', p_alerta_id;
    END IF;
END;
$$;


--
-- TOC entry 1193 (class 1255 OID 186380)
-- Name: fn_set_contexto(text, text, text, text, text); Type: FUNCTION; Schema: audit; Owner: -
--

CREATE FUNCTION audit.fn_set_contexto(p_usuario_id text, p_usuario_nom text DEFAULT NULL::text, p_ip_address text DEFAULT NULL::text, p_sesion_id text DEFAULT NULL::text, p_app_nombre text DEFAULT 'SIGEPAA'::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    PERFORM set_config('app.usuario_id',  COALESCE(p_usuario_id,  ''), TRUE);
    PERFORM set_config('app.usuario_nom', COALESCE(p_usuario_nom, ''), TRUE);
    PERFORM set_config('app.ip_address',  COALESCE(p_ip_address,  ''), TRUE);
    PERFORM set_config('app.sesion_id',   COALESCE(p_sesion_id,   ''), TRUE);
    PERFORM set_config('app.nombre',      COALESCE(p_app_nombre,  'SIGEPAA'), TRUE);
END;
$$;


--
-- TOC entry 10038 (class 0 OID 0)
-- Dependencies: 1193
-- Name: FUNCTION fn_set_contexto(p_usuario_id text, p_usuario_nom text, p_ip_address text, p_sesion_id text, p_app_nombre text); Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON FUNCTION audit.fn_set_contexto(p_usuario_id text, p_usuario_nom text, p_ip_address text, p_sesion_id text, p_app_nombre text) IS 'Inicializa el contexto de auditoría para la transacción actual. Llamar al inicio de cada request HTTP desde el backend. Ejemplo: SELECT audit.fn_set_contexto(''user-uuid'', ''Admin'', ''10.0.0.1'', ''jti-123'');';


--
-- TOC entry 1875 (class 1255 OID 186381)
-- Name: actualizar_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.actualizar_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Actualiza updated_at SOLO si hay cambios reales (opcional, pero evita actualizaciones innecesarias)
    IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$;


--
-- TOC entry 645 (class 1255 OID 190675)
-- Name: fn_actualizar_estado_activo(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_actualizar_estado_activo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- 1. Desactiva el estado anterior en el historial
    UPDATE historial_estados_acometida
    SET activo = FALSE
    WHERE acometida_id = NEW.acometida_id AND activo = TRUE;

    -- 2. Sincroniza el estado en la tabla principal (OPCIONAL)
    UPDATE acometida
    SET estado_id = NEW.estado_id
    WHERE acometida_id = NEW.acometida_id;

    RETURN NEW;
END;
$$;


--
-- TOC entry 572 (class 1255 OID 186382)
-- Name: fn_auditar_cambio_estado(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_auditar_cambio_estado() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_usuario_id UUID := 'e3400d18-86e1-4eee-9a8b-3e7eaf812a95'::UUID;
BEGIN
    BEGIN
        v_usuario_id := current_setting('app.usuario_id', TRUE)::UUID;
    EXCEPTION WHEN OTHERS THEN
        v_usuario_id := 'e3400d18-86e1-4eee-9a8b-3e7eaf812a95'::UUID;
    END;

    INSERT INTO seguimiento_lectura (
        acometida_id,
        lectura_id,
        usuario_id,
        lectura_estado_id,
        lectura_estado_anterior_id,
        accion,
        descripcion
    ) VALUES (
        NEW.acometida_id,
        NEW.lectura_id,
        v_usuario_id,
        NEW.lectura_estado_id,
        OLD.lectura_estado_id,
        CASE WHEN TG_OP = 'INSERT' THEN 'CREACION' ELSE 'CAMBIO ESTADO' END,
        CASE WHEN TG_OP = 'UPDATE' THEN
            'De ' || COALESCE((SELECT nombre FROM lectura_estado WHERE lectura_estado_id = OLD.lectura_estado_id), 'DESCONOCIDO') ||
            ' a ' || COALESCE((SELECT nombre FROM lectura_estado WHERE lectura_estado_id = NEW.lectura_estado_id), 'DESCONOCIDO')
        ELSE 'Nueva lectura creada (automatica)'
        END
    );

    RETURN NEW;
END;
$$;


--
-- TOC entry 968 (class 1255 OID 190749)
-- Name: fn_auto_cierre_auditoria(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_auto_cierre_auditoria() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- A. SI YA ESTABA COMPLETO: Mantenerlo así (Bloqueo de seguridad)
    -- Solo se reabre si el usuario envía explícitamente completo = FALSE en el UPDATE
    IF OLD.completo = TRUE AND NEW.completo = TRUE THEN
        -- No hacemos nada, se queda cerrado
        NULL;

    -- B. SI SE MARCA MANUALMENTE AHORA:
    ELSIF NEW.completo = TRUE AND OLD.completo = FALSE THEN
        NEW.fecha_cierre := NOW();

    -- C. SI SE LLEGA AL 100% AUTOMÁTICAMENTE:
    ELSIF NEW.total_completadas >= NEW.total_esperado AND NEW.total_esperado > 0 THEN
        IF NOT NEW.completo THEN
            NEW.completo := TRUE;
            NEW.fecha_cierre := NOW();
        END IF;

    -- D. SI BAJA DEL 100% (POR BORRADO):
    -- Solo se reabre si NO fue cerrado manualmente (sin supervisor)
    ELSIF NEW.total_completadas < NEW.total_esperado AND NEW.usuario_supervisor_id IS NULL THEN
        NEW.completo := FALSE;
        NEW.fecha_cierre := NULL;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;


--
-- TOC entry 1272 (class 1255 OID 186383)
-- Name: fn_block_duplicate_lectura(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_block_duplicate_lectura() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    cnt_normal INTEGER := 0;
    cnt_especial INTEGER := 0;
    mes CHAR(7);
    inicio_periodo DATE;
    fin_periodo DATE;
    existe_periodo BOOLEAN := FALSE;
BEGIN
    mes := fn_mes_lectura(NEW.fecha_lectura);

    SELECT EXISTS (SELECT 1 FROM siguiente_lectura WHERE siguiente_lectura.acometida_id = NEW.acometida_id),
           fecha_inicio_periodo,
           fecha_fin_periodo
    INTO existe_periodo, inicio_periodo, fin_periodo
    FROM siguiente_lectura
    WHERE siguiente_lectura.acometida_id = NEW.acometida_id;

    IF NOT existe_periodo THEN
        IF NEW.novedad LIKE '%INICIAL%' OR NEW.novedad LIKE '%CAMBIO DE MEDIDOR%' THEN
            RAISE NOTICE 'PRIMERA LECTURA PERMITIDA | Acometida: % | Fecha: %', NEW.acometida_id, NEW.fecha_lectura;
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'Primera lectura DEBE ser INICIAL o CAMBIO DE MEDIDOR para acometida %', NEW.acometida_id;
        END IF;
    END IF;

    IF NEW.fecha_lectura::DATE < inicio_periodo THEN
        RAISE EXCEPTION 'Prohibido: Lectura antes del periodo (% < %)',
                        NEW.fecha_lectura::DATE, inicio_periodo;
    END IF;

    IF NEW.fecha_lectura::DATE > fin_periodo THEN
        RAISE EXCEPTION 'Prohibido: Lectura despues del periodo (% > %)',
                        NEW.fecha_lectura::DATE, fin_periodo;
    END IF;

    SELECT COUNT(*) INTO cnt_normal
    FROM lectura
    WHERE lectura.acometida_id = NEW.acometida_id
      AND fn_mes_lectura(lectura.fecha_lectura) = mes
      AND lectura.novedad NOT LIKE '%INICIAL%'
      AND lectura.novedad NOT LIKE '%CAMBIO DE MEDIDOR%';

    SELECT COUNT(*) INTO cnt_especial
    FROM lectura
    WHERE lectura.acometida_id = NEW.acometida_id
      AND fn_mes_lectura(lectura.fecha_lectura) = mes
      AND (lectura.novedad LIKE '%INICIAL%' OR lectura.novedad LIKE '%CAMBIO DE MEDIDOR%');

    IF (NEW.novedad NOT LIKE '%INICIAL%' AND NEW.novedad NOT LIKE '%CAMBIO DE MEDIDOR%' AND cnt_normal >= 1)
       OR ((NEW.novedad LIKE '%INICIAL%' OR NEW.novedad LIKE '%CAMBIO DE MEDIDOR%') AND cnt_especial >= 2) THEN
        RAISE EXCEPTION 'Duplicado: Maximo % % por mes (%)',
              CASE WHEN NEW.novedad LIKE '%INICIAL%' OR NEW.novedad LIKE '%CAMBIO DE MEDIDOR%' THEN 2 ELSE 1 END,
              CASE WHEN NEW.novedad LIKE '%INICIAL%' OR NEW.novedad LIKE '%CAMBIO DE MEDIDOR%' THEN 'especiales' ELSE 'normales' END,
              mes;
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en bloqueo: %', SQLERRM;
        RAISE;
END;
$$;


--
-- TOC entry 771 (class 1255 OID 186384)
-- Name: fn_control_siguiente_lectura_mensual(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_control_siguiente_lectura_mensual() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    fecha_base DATE;
    ultima_fecha_ideal DATE;
    proxima_fecha_ideal DATE;
    v_acometida_id VARCHAR(10) := NEW.acometida_id;
BEGIN
    PERFORM 1 FROM acometida WHERE acometida.acometida_id = v_acometida_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Acometida % no encontrada', v_acometida_id;
    END IF;

    SELECT COALESCE(fecha_inicio_lecturas, NEW.fecha_lectura::DATE) INTO fecha_base
    FROM acometida WHERE acometida.acometida_id = v_acometida_id;

    IF fecha_base IS NULL THEN
        fecha_base := NEW.fecha_lectura::DATE;
        UPDATE acometida SET fecha_inicio_lecturas = fecha_base WHERE acometida.acometida_id = v_acometida_id;
    END IF;

    SELECT fecha_siguiente_lectura INTO ultima_fecha_ideal
    FROM siguiente_lectura WHERE siguiente_lectura.acometida_id = v_acometida_id;
    IF ultima_fecha_ideal IS NULL THEN
        ultima_fecha_ideal := fecha_base;
    END IF;

    proxima_fecha_ideal := ultima_fecha_ideal + INTERVAL '1 month';

    IF EXTRACT(DAY FROM proxima_fecha_ideal) <> EXTRACT(DAY FROM fecha_base) THEN
        proxima_fecha_ideal := date_trunc('month', proxima_fecha_ideal) + INTERVAL '1 month - 1 day';
    END IF;

    INSERT INTO siguiente_lectura (
        acometida_id, ultima_lectura_id, fecha_siguiente_lectura,
        fecha_inicio_periodo, fecha_fin_periodo, created_at, updated_at
    ) VALUES (
        v_acometida_id, NEW.lectura_id, proxima_fecha_ideal,
        date_trunc('month', proxima_fecha_ideal),
        (date_trunc('month', proxima_fecha_ideal) + INTERVAL '1 month' - INTERVAL '1 day'),
        NOW(), NOW()
    )
    ON CONFLICT (acometida_id) DO UPDATE SET
        ultima_lectura_id = EXCLUDED.ultima_lectura_id,
        fecha_siguiente_lectura = EXCLUDED.fecha_siguiente_lectura,
        fecha_inicio_periodo = date_trunc('month', EXCLUDED.fecha_siguiente_lectura),
        fecha_fin_periodo = (date_trunc('month', EXCLUDED.fecha_siguiente_lectura) + INTERVAL '1 month' - INTERVAL '1 day'),
        updated_at = NOW();

    RAISE NOTICE 'Siguiente lectura para %: %', v_acometida_id, proxima_fecha_ideal;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en control siguiente: %', SQLERRM;
        RAISE;
END;
$$;


--
-- TOC entry 1311 (class 1255 OID 186385)
-- Name: fn_inicializar_siguiente_lectura(character varying, date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_inicializar_siguiente_lectura(p_acometida_id character varying, p_fecha_base date) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    IF p_acometida_id IS NULL THEN
        RAISE EXCEPTION 'Parametro p_acometida_id requerido';
    END IF;
    IF p_fecha_base IS NULL THEN
        RAISE EXCEPTION 'Parametro p_fecha_base requerido';
    END IF;

    DECLARE
        proxima_fecha_ideal DATE := p_fecha_base + INTERVAL '1 month';
        dia_base INTEGER := EXTRACT(DAY FROM p_fecha_base);
    BEGIN
        IF EXTRACT(DAY FROM proxima_fecha_ideal) <> dia_base THEN
            proxima_fecha_ideal := date_trunc('month', proxima_fecha_ideal) + INTERVAL '1 month - 1 day';
        END IF;

        INSERT INTO siguiente_lectura (
            acometida_id,
            ultima_lectura_id,
            fecha_siguiente_lectura,
            fecha_inicio_periodo,
            fecha_fin_periodo,
            created_at,
            updated_at
        ) VALUES (
            p_acometida_id,
            NULL,
            proxima_fecha_ideal,
            date_trunc('month', proxima_fecha_ideal),
            (date_trunc('month', proxima_fecha_ideal) + INTERVAL '1 month' - INTERVAL '1 day'),
            NOW(),
            NOW()
        )
        ON CONFLICT (acometida_id) DO NOTHING;

        RAISE NOTICE 'SiguienteLectura inicializada para % en fecha %', p_acometida_id, proxima_fecha_ideal;
    END;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error al inicializar SiguienteLectura para %: %', p_acometida_id, SQLERRM;
        RAISE;
END;
$$;


--
-- TOC entry 826 (class 1255 OID 186386)
-- Name: fn_insert_cambio_medidor_reading(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_insert_cambio_medidor_reading() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    pend_id INTEGER;
    fecha_base DATE := CURRENT_DATE;
BEGIN
    IF NEW.numero_medidor = OLD.numero_medidor THEN
        RETURN NEW;
    END IF;

    SELECT lectura_estado_id INTO pend_id
    FROM lectura_estado WHERE codigo = 'PEND' LIMIT 1;

    IF pend_id IS NULL THEN
        RAISE EXCEPTION 'Estado PEND no encontrado';
    END IF;

    INSERT INTO lectura (
        acometida_id, fecha_lectura, hora_lectura, sector, cuenta, clave_catastral,
        valor_lectura, tasa_alcantarillado, lectura_anterior, lectura_actual,
        codigo_ingreso_renta, novedad, codigo_ingreso, tipo_novedad_lectura_id, lectura_estado_id
    ) VALUES (
        NEW.acometida_id, fecha_base, CURRENT_TIME, NEW.sector, NEW.cuenta, NEW.clave_catastral,
        0, 0, 0, 0, NULL, 'CAMBIO DE MEDIDOR AUTOMATICO', NULL, 8, pend_id
    );

    UPDATE acometida
    SET fecha_inicio_lecturas = COALESCE(fecha_inicio_lecturas, fecha_base)
    WHERE acometida_id = NEW.acometida_id;

    RAISE NOTICE 'Lectura cambio medidor para %', NEW.acometida_id;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en cambio medidor: %', SQLERRM;
        RAISE;
END;
$$;


--
-- TOC entry 1561 (class 1255 OID 186387)
-- Name: fn_insert_initial_reading_full(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_insert_initial_reading_full() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    pend_id INTEGER;
    fecha_base DATE := CURRENT_DATE;
BEGIN
    IF NEW.acometida_id IS NULL THEN RAISE EXCEPTION 'acometida_id requerido'; END IF;
    IF NEW.sector IS NULL THEN RAISE EXCEPTION 'sector requerido'; END IF;
    IF NEW.cuenta IS NULL THEN RAISE EXCEPTION 'cuenta requerida'; END IF;
    IF NEW.clave_catastral IS NULL THEN RAISE EXCEPTION 'clave_catastral requerida'; END IF;

    SELECT lectura_estado_id INTO pend_id
    FROM lectura_estado
    WHERE codigo = 'PEND' LIMIT 1;

    IF pend_id IS NULL THEN
        RAISE EXCEPTION 'Estado PEND no encontrado';
    END IF;

    INSERT INTO lectura (
        acometida_id, fecha_lectura, hora_lectura, sector, cuenta, clave_catastral,
        valor_lectura, tasa_alcantarillado, lectura_anterior, lectura_actual,
        codigo_ingreso_renta, novedad, codigo_ingreso, tipo_novedad_lectura_id, lectura_estado_id
    ) VALUES (
        NEW.acometida_id, fecha_base, CURRENT_TIME, NEW.sector, NEW.cuenta, NEW.clave_catastral,
        0, 0, 0, 0, NULL, 'LECTURA INICIAL AUTOMATICA', NULL, 8, pend_id
    );

    UPDATE acometida
    SET fecha_inicio_lecturas = fecha_base
    WHERE acometida_id = NEW.acometida_id;

    RAISE NOTICE 'Lectura inicial creada para %', NEW.acometida_id;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en lectura inicial: %', SQLERRM;
        RAISE;
END;
$$;


--
-- TOC entry 899 (class 1255 OID 186388)
-- Name: fn_mes_lectura(date); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_mes_lectura(p_fecha date) RETURNS character
    LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER
    AS $$
BEGIN
    IF p_fecha IS NULL THEN
        RAISE EXCEPTION 'Fecha requerida para fn_mes_lectura';
    END IF;
    RETURN TO_CHAR(p_fecha, 'YYYY-MM');
END;
$$;


--
-- TOC entry 1696 (class 1255 OID 186389)
-- Name: fn_mes_lectura(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_mes_lectura(ts timestamp without time zone) RETURNS character
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT TO_CHAR(ts::date, 'YYYY-MM');
$$;


--
-- TOC entry 1829 (class 1255 OID 190751)
-- Name: fn_sync_lectura_auditoria(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_sync_lectura_auditoria() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_sector_id INTEGER;
    v_mes_lectura DATE;
BEGIN
    -- 1. Identificar periodo y sector
    v_mes_lectura := date_trunc('month', COALESCE(NEW.fecha_lectura, OLD.fecha_lectura))::DATE;
    v_sector_id := COALESCE(NEW.sector, OLD.sector);

    -- 2. SI ES INSERT: Verificar si existe la auditoría, si no, CREARLA (Lazy Initialization)
    IF (TG_OP = 'INSERT') THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.auditoria_lectura_sector
            WHERE mes_lectura = v_mes_lectura AND sector_id = v_sector_id
        ) THEN
            -- Llamamos al procedimiento que ya tienes para que cree la meta de este sector
            CALL pr_generar_auditoria_mensual(v_mes_lectura);
        END IF;

        -- Ahora sí, sumamos 1
        UPDATE public.auditoria_lectura_sector
        SET total_completadas = total_completadas + 1
        WHERE mes_lectura = v_mes_lectura AND sector_id = v_sector_id;

    -- 3. CASO DELETE: Restar 1
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.auditoria_lectura_sector
        SET total_completadas = total_completadas - 1
        WHERE mes_lectura = v_mes_lectura AND sector_id = v_sector_id;
    END IF;

    RETURN NULL;
END;
$$;


--
-- TOC entry 1107 (class 1255 OID 186390)
-- Name: fn_update_meter_reading_initial(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_update_meter_reading_initial() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    pend_id INTEGER;
    lectura_id INTEGER;
    fecha_base DATE;
    count_completadas INTEGER := 0;
    proxima_ideal DATE;
BEGIN
    IF (OLD.numero_medidor IS DISTINCT FROM NEW.numero_medidor)
       AND NEW.numero_medidor IS NOT NULL THEN

        IF NEW.acometida_id IS NULL THEN
            RAISE EXCEPTION 'acometida_id requerido';
        END IF;
        IF NEW.sector IS NULL THEN
            RAISE EXCEPTION 'sector requerido en acometida %', NEW.acometida_id;
        END IF;
        IF NEW.cuenta IS NULL THEN
            RAISE EXCEPTION 'cuenta requerida en acometida %', NEW.acometida_id;
        END IF;
        IF NEW.clave_catastral IS NULL THEN
            RAISE EXCEPTION 'clave_catastral requerida en acometida %', NEW.acometida_id;
        END IF;

        SELECT lectura_estado_id INTO pend_id
        FROM lectura_estado
        WHERE codigo = 'PEND' LIMIT 1;

        IF pend_id IS NULL THEN
            RAISE EXCEPTION 'Estado PEND no encontrado';
        END IF;

        INSERT INTO lectura (
            acometida_id,
            fecha_lectura,
            hora_lectura,
            sector,
            cuenta,
            clave_catastral,
            valor_lectura,
            tasa_alcantarillado,
            lectura_anterior,
            lectura_actual,
            codigo_ingreso_renta,
            novedad,
            codigo_ingreso,
            tipo_novedad_lectura_id,
            lectura_estado_id
        ) VALUES (
            NEW.acometida_id,
            CURRENT_DATE,
            CURRENT_TIME,
            NEW.sector,
            NEW.cuenta,
            NEW.clave_catastral,
            0,
            0,
            0,
            0,
            NULL,
            'LECTURA INICIAL POR CAMBIO DE MEDIDOR: ' || NEW.numero_medidor,
            NULL,
            8,
            pend_id
        ) RETURNING lectura_id INTO lectura_id;

        SELECT fecha_inicio_lecturas INTO fecha_base
        FROM acometida
        WHERE acometida_id = NEW.acometida_id;

        IF fecha_base IS NULL THEN
            RAISE EXCEPTION 'fecha_inicio_lecturas no seteada. Crea acometida primero.';
        END IF;

        SELECT COUNT(*) INTO count_completadas
        FROM lectura l
        JOIN lectura_estado le ON le.lectura_estado_id = l.lectura_estado_id
        WHERE l.acometida_id = NEW.acometida_id
          AND le.codigo IN ('REAL', 'FACT');

        proxima_ideal := fecha_base + INTERVAL '1 month' * (count_completadas + 1);

        INSERT INTO siguiente_lectura (
            acometida_id,
            ultima_lectura_id,
            fecha_siguiente_lectura,
            fecha_inicio_periodo,
            fecha_fin_periodo
        ) VALUES (
            NEW.acometida_id,
            lectura_id,
            proxima_ideal,
            date_trunc('month', proxima_ideal),
            (date_trunc('month', proxima_ideal) + INTERVAL '1 month' - INTERVAL '1 day')
        )
        ON CONFLICT (acometida_id) DO UPDATE SET
            ultima_lectura_id = EXCLUDED.ultima_lectura_id,
            fecha_siguiente_lectura = EXCLUDED.fecha_siguiente_lectura,
            fecha_inicio_periodo = EXCLUDED.fecha_inicio_periodo,
            fecha_fin_periodo = EXCLUDED.fecha_fin_periodo;

        RAISE NOTICE 'Cambio medidor para % | Fecha base INMUTABLE: % | Proxima recalculada: % (rango: % a %)',
                     NEW.acometida_id, fecha_base, proxima_ideal,
                     date_trunc('month', proxima_ideal), (date_trunc('month', proxima_ideal) + INTERVAL '1 month' - INTERVAL '1 day');
    END IF;

    RETURN NEW;
END;
$$;


--
-- TOC entry 850 (class 1255 OID 190776)
-- Name: pr_generar_auditoria_mensual(date); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.pr_generar_auditoria_mensual(IN p_fecha date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.auditoria_lectura_sector (mes_lectura, sector_id, total_esperado)
    SELECT
        date_trunc('month', p_fecha)::DATE,
        a.sector,
        COUNT(*) as total
    FROM public.acometida a
    JOIN public.cat_estados_acometida e ON a.estado_id = e.id_estado
    WHERE e.permite_lectura = TRUE
    GROUP BY a.sector
    ON CONFLICT (mes_lectura, sector_id) DO UPDATE
    SET total_esperado = EXCLUDED.total_esperado;

    RAISE NOTICE 'Auditoría generada para el periodo %', p_fecha;
END;
$$;


--
-- TOC entry 1054 (class 1255 OID 186391)
-- Name: trg_update_is_locked_out(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trg_update_is_locked_out() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.is_locked_out := (NEW.lockout_until IS NOT NULL AND NEW.lockout_until > CURRENT_TIMESTAMP);
    RETURN NEW;
END;
$$;


--
-- TOC entry 1717 (class 1255 OID 186392)
-- Name: update_cliente_usuario_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_cliente_usuario_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$;


--
-- TOC entry 660 (class 1255 OID 186393)
-- Name: update_consumo_promedio(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_consumo_promedio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO consumo_promedio (acometida_id, average_consumption, updated_at)
    VALUES (
        NEW.acometida_id,
        ROUND(
          GREATEST(
            COALESCE((
              SELECT AVG(CASE
                            WHEN (sub.lectura_actual - sub.lectura_anterior) >= 0
                            THEN (sub.lectura_actual - sub.lectura_anterior)
                        END)
              FROM (
                SELECT lectura_actual, lectura_anterior
                FROM lectura
                WHERE acometida_id = NEW.acometida_id
                  AND fecha_lectura IS NOT NULL
                ORDER BY fecha_lectura DESC
                LIMIT 10
              ) sub
            ), 0),
          0),
        2),
        NOW()
    )
    ON CONFLICT (acometida_id)
    DO UPDATE SET
        average_consumption = EXCLUDED.average_consumption,
        updated_at = NOW();

    RETURN NEW;
END;
$$;


--
-- TOC entry 1373 (class 1255 OID 186394)
-- Name: update_empleados_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_empleados_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$;


--
-- TOC entry 1868 (class 1255 OID 186395)
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


--
-- TOC entry 1259 (class 1255 OID 186396)
-- Name: generar_codigo_orden(); Type: FUNCTION; Schema: work_orders; Owner: -
--

CREATE FUNCTION work_orders.generar_codigo_orden() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.codigo_orden := 'OT-' ||
                        TO_CHAR(NEW.fecha_creacion, 'YYYY') || '-' ||
                        LPAD(NEW.numero_secuencial::TEXT, 7, '0');
    RETURN NEW;
END;
$$;


--
-- TOC entry 1702 (class 1255 OID 186397)
-- Name: registrar_cambio_estado(); Type: FUNCTION; Schema: work_orders; Owner: -
--

CREATE FUNCTION work_orders.registrar_cambio_estado() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'work_orders', 'public'
    AS $$
DECLARE
    old_estado_nombre TEXT;
    new_estado_nombre TEXT;
BEGIN
    -- Obtener nombres de estados para descripción clara
    SELECT nombre_estado INTO old_estado_nombre 
    FROM work_orders.estado_orden_trabajo 
    WHERE id_estado = OLD.estado;

    SELECT nombre_estado INTO new_estado_nombre 
    FROM work_orders.estado_orden_trabajo 
    WHERE id_estado = NEW.estado;

    -- INSERT: registrar creación
    IF TG_OP = 'INSERT' THEN
        INSERT INTO work_orders.historial_estado_orden_trabajo (
            id_orden_trabajo,
            id_estado,
            fecha_cambio,
            id_usuario,
            descripcion_cambio,
            clave_catastral,
            codigo_orden
        ) VALUES (
            NEW.id_orden_trabajo,
            NEW.estado,
            NEW.fecha_creacion,
            NEW.usuario_creacion,
            'Orden creada - Estado inicial: ' || COALESCE(new_estado_nombre, 'Desconocido'),
            NEW.clave_catastral,
            NEW.codigo_orden
        );
        RETURN NEW;
    END IF;

    -- UPDATE: solo si cambió el estado
    IF TG_OP = 'UPDATE' AND NEW.estado IS DISTINCT FROM OLD.estado THEN
        INSERT INTO work_orders.historial_estado_orden_trabajo (
            id_orden_trabajo,
            id_estado,
            fecha_cambio,
            id_usuario,
            descripcion_cambio,
            clave_catastral,
            codigo_orden
        ) VALUES (
            NEW.id_orden_trabajo,
            NEW.estado,
            CURRENT_TIMESTAMP,
            COALESCE(NEW.usuario_asignacion, NEW.usuario_completacion, NEW.usuario_creacion),
            'Cambio de estado: ' || COALESCE(old_estado_nombre, 'Desconocido') || 
            ' → ' || COALESCE(new_estado_nombre, 'Desconocido'),
            NEW.clave_catastral,
            NEW.codigo_orden
        );
    END IF;

    RETURN NEW;
END;
$$;


--
-- TOC entry 1873 (class 1255 OID 186398)
-- Name: set_updated_at(); Type: FUNCTION; Schema: work_orders; Owner: -
--

CREATE FUNCTION work_orders.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 249 (class 1259 OID 186399)
-- Name: catalogo_concepto_factura; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.catalogo_concepto_factura (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(200) NOT NULL,
    monto_base numeric(10,2) DEFAULT 0 NOT NULL,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 250 (class 1259 OID 186409)
-- Name: catalogo_concepto_factura_id_seq; Type: SEQUENCE; Schema: acometidas; Owner: -
--

CREATE SEQUENCE acometidas.catalogo_concepto_factura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10039 (class 0 OID 0)
-- Dependencies: 250
-- Name: catalogo_concepto_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: acometidas; Owner: -
--

ALTER SEQUENCE acometidas.catalogo_concepto_factura_id_seq OWNED BY acometidas.catalogo_concepto_factura.id;


--
-- TOC entry 251 (class 1259 OID 186410)
-- Name: catalogo_tipo_documento; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.catalogo_tipo_documento (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    nombre character varying(200) NOT NULL,
    descripcion text,
    obligatorio boolean DEFAULT true,
    aplica_natural boolean DEFAULT true,
    aplica_juridica boolean DEFAULT true,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 252 (class 1259 OID 186423)
-- Name: catalogo_tipo_documento_id_seq; Type: SEQUENCE; Schema: acometidas; Owner: -
--

CREATE SEQUENCE acometidas.catalogo_tipo_documento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10040 (class 0 OID 0)
-- Dependencies: 252
-- Name: catalogo_tipo_documento_id_seq; Type: SEQUENCE OWNED BY; Schema: acometidas; Owner: -
--

ALTER SEQUENCE acometidas.catalogo_tipo_documento_id_seq OWNED BY acometidas.catalogo_tipo_documento.id;


--
-- TOC entry 253 (class 1259 OID 186424)
-- Name: contrato_servicio; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.contrato_servicio (
    id_contrato uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    numero_contrato character varying(50) NOT NULL,
    id_medidor uuid,
    id_tarifa integer,
    costo_materiales numeric(10,2) DEFAULT 0 NOT NULL,
    costo_mano_obra numeric(10,2) DEFAULT 0 NOT NULL,
    tasa_conexion numeric(10,2) DEFAULT 0 NOT NULL,
    valor_total numeric(10,2) GENERATED ALWAYS AS (((costo_materiales + costo_mano_obra) + tasa_conexion)) STORED,
    estado_firma acometidas.estado_firma DEFAULT 'PENDIENTE'::acometidas.estado_firma,
    url_contrato_pdf character varying(1000),
    url_contrato_firmado character varying(1000),
    fecha_firma_usuario timestamp with time zone,
    fecha_firma_epaa timestamp with time zone,
    id_generador uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 254 (class 1259 OID 186443)
-- Name: documento_adjunto; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.documento_adjunto (
    id_documento uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    id_tipo_documento integer NOT NULL,
    url_archivo character varying(1000) NOT NULL,
    nombre_original character varying(500),
    mime_type character varying(100),
    tamano_bytes bigint,
    hash_sha256 character varying(64),
    estado_validacion acometidas.estado_validacion_doc DEFAULT 'PENDIENTE'::acometidas.estado_validacion_doc,
    observacion text,
    id_validador uuid,
    fecha_validacion timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 255 (class 1259 OID 186456)
-- Name: factura_inspeccion; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.factura_inspeccion (
    id_factura uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    numero_factura character varying(50) NOT NULL,
    id_concepto integer,
    monto numeric(10,2) NOT NULL,
    estado acometidas.estado_pago DEFAULT 'PENDIENTE'::acometidas.estado_pago,
    fecha_vencimiento date,
    fecha_pago timestamp with time zone,
    metodo_pago character varying(100),
    referencia_pago character varying(200),
    url_comprobante character varying(1000),
    id_cajero uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 256 (class 1259 OID 186469)
-- Name: historial_estado; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.historial_estado (
    id_historial uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    estado_anterior acometidas.estado_solicitud,
    estado_nuevo acometidas.estado_solicitud NOT NULL,
    id_usuario_accion uuid NOT NULL,
    comentario text,
    datos_extra jsonb DEFAULT '{}'::jsonb,
    fecha_cambio timestamp with time zone DEFAULT now()
);


--
-- TOC entry 257 (class 1259 OID 186481)
-- Name: informe_inspeccion; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.informe_inspeccion (
    id_informe uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    id_solicitud uuid NOT NULL,
    resultado acometidas.resultado_inspeccion NOT NULL,
    distancia_red_m numeric(8,2),
    diametro_conexion character varying(20),
    condiciones_terreno text,
    observaciones text,
    geom_acometida public.geometry(Point,4326),
    costo_materiales numeric(10,2),
    costo_mano_obra numeric(10,2),
    costo_total numeric(10,2) GENERATED ALWAYS AS ((costo_materiales + costo_mano_obra)) STORED,
    aprobado boolean,
    motivo_rechazo text,
    id_aprobador uuid,
    fecha_aprobacion timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 258 (class 1259 OID 186494)
-- Name: inventario_medidor; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.inventario_medidor (
    id_medidor uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    numero_serie character varying(100) NOT NULL,
    marca character varying(100),
    modelo character varying(100),
    diametro_mm numeric(6,2),
    fecha_adquisicion date,
    disponible boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 259 (class 1259 OID 186503)
-- Name: notificacion; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.notificacion (
    id_notificacion uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    id_destinatario uuid NOT NULL,
    canal acometidas.canal_notificacion NOT NULL,
    asunto character varying(300) NOT NULL,
    cuerpo text NOT NULL,
    enviado boolean DEFAULT false,
    fecha_envio timestamp with time zone,
    error_envio text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 260 (class 1259 OID 186517)
-- Name: registro_catastral; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.registro_catastral (
    id_registro uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_solicitud uuid NOT NULL,
    id_contrato uuid,
    clave_catastral character varying(100) NOT NULL,
    numero_medidor character varying(100) NOT NULL,
    direccion_exacta character varying(500) NOT NULL,
    geom public.geometry(Point,4326) NOT NULL,
    diametro_conexion character varying(20),
    tipo_servicio character varying(100),
    fecha_instalacion date NOT NULL,
    numero_cuenta character varying(100),
    activo boolean DEFAULT false,
    fecha_activacion timestamp with time zone,
    id_registrador uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 261 (class 1259 OID 186533)
-- Name: solicitud; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.solicitud (
    id_solicitud uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_cliente character varying(13) NOT NULL,
    tipo_persona acometidas.tipo_persona NOT NULL,
    tipo_acometida acometidas.tipo_acometida NOT NULL,
    uso_predio acometidas.uso_predio NOT NULL,
    direccion character varying(500) NOT NULL,
    clave_catastral character varying(100),
    geom public.geometry(Point,4326),
    estado acometidas.estado_solicitud DEFAULT 'DRAFT'::acometidas.estado_solicitud NOT NULL,
    datos_adicionales jsonb DEFAULT '{}'::jsonb,
    id_analista uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 262 (class 1259 OID 186550)
-- Name: solicitud_orden_trabajo; Type: TABLE; Schema: acometidas; Owner: -
--

CREATE TABLE acometidas.solicitud_orden_trabajo (
    id_solicitud uuid NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    tipo_orden acometidas.tipo_orden NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 263 (class 1259 OID 186557)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    usuario_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login timestamp without time zone,
    failed_attempts integer DEFAULT 0 NOT NULL,
    two_factor_enabled boolean DEFAULT false NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    observaciones character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT usuarios_failed_attempts_check CHECK ((failed_attempts >= 0))
);


--
-- TOC entry 264 (class 1259 OID 186580)
-- Name: v_panel_solicitudes; Type: VIEW; Schema: acometidas; Owner: -
--

CREATE VIEW acometidas.v_panel_solicitudes AS
 SELECT s.id_solicitud,
    s.estado,
    s.tipo_acometida,
    s.uso_predio,
    s.direccion,
    s.clave_catastral,
    s.created_at AS fecha_solicitud,
    s.id_cliente AS identificacion_cliente,
    a.username AS nombre_analista,
    f.numero_factura,
    f.estado AS estado_pago,
    c.numero_contrato,
    c.estado_firma,
    c.valor_total,
    r.numero_cuenta,
    r.activo AS servicio_activo,
    (EXTRACT(day FROM (now() - s.created_at)))::integer AS dias_en_proceso
   FROM ((((acometidas.solicitud s
     LEFT JOIN public.usuarios a ON ((a.usuario_id = s.id_analista)))
     LEFT JOIN acometidas.factura_inspeccion f ON ((f.id_solicitud = s.id_solicitud)))
     LEFT JOIN acometidas.contrato_servicio c ON ((c.id_solicitud = s.id_solicitud)))
     LEFT JOIN acometidas.registro_catastral r ON ((r.id_solicitud = s.id_solicitud)));


--
-- TOC entry 265 (class 1259 OID 186585)
-- Name: alerta; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.alerta (
    alerta_id bigint NOT NULL,
    tipo_alerta text NOT NULL,
    severidad audit.audit_severidad DEFAULT 'MEDIUM'::audit.audit_severidad NOT NULL,
    descripcion text NOT NULL,
    tabla_nombre text,
    usuario_id uuid,
    usuario_nombre text,
    audit_ids bigint[] DEFAULT ARRAY[]::bigint[],
    resuelta boolean DEFAULT false NOT NULL,
    resuelta_por uuid,
    resuelta_at timestamp with time zone,
    resolucion_nota text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 10041 (class 0 OID 0)
-- Dependencies: 265
-- Name: TABLE alerta; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON TABLE audit.alerta IS 'Alertas automáticas generadas por anomalías detectadas en audit.registro. Revisable por administradores. No modificable por usuarios normales.';


--
-- TOC entry 266 (class 1259 OID 186601)
-- Name: alerta_alerta_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

ALTER TABLE audit.alerta ALTER COLUMN alerta_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME audit.alerta_alerta_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 267 (class 1259 OID 186602)
-- Name: registro; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro (
    audit_id bigint NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text NOT NULL,
    tabla_nombre text NOT NULL,
    operacion audit.audit_operacion NOT NULL,
    pk_valor jsonb NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
)
PARTITION BY RANGE (audit_timestamp);

ALTER TABLE ONLY audit.registro FORCE ROW LEVEL SECURITY;


--
-- TOC entry 10042 (class 0 OID 0)
-- Dependencies: 267
-- Name: TABLE registro; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON TABLE audit.registro IS 'Registro central de auditoría enterprise. Particionada mensualmente. Append-only: UPDATE y DELETE están protegidos por RLS y permisos de rol.';


--
-- TOC entry 10043 (class 0 OID 0)
-- Dependencies: 267
-- Name: COLUMN registro.pk_valor; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.registro.pk_valor IS 'Valor de la clave primaria de la fila afectada, siempre en formato JSONB para soportar PKs compuestas. Ej: {"factura_id": 42}';


--
-- TOC entry 10044 (class 0 OID 0)
-- Dependencies: 267
-- Name: COLUMN registro.campos_cambiados; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.registro.campos_cambiados IS 'Array de nombres de columnas que realmente cambiaron en un UPDATE. Permite búsqueda rápida sin parsear diff_jsonb.';


--
-- TOC entry 10045 (class 0 OID 0)
-- Dependencies: 267
-- Name: COLUMN registro.diff_jsonb; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON COLUMN audit.registro.diff_jsonb IS 'Diferencial columna a columna en UPDATE. Formato: {"columna": {"antes": valor_old, "despues": valor_new}}. Vacío en INSERT y DELETE.';


--
-- TOC entry 268 (class 1259 OID 186617)
-- Name: registro_2024_01; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_01 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 269 (class 1259 OID 186634)
-- Name: registro_2024_02; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_02 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 270 (class 1259 OID 186651)
-- Name: registro_2024_03; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_03 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 271 (class 1259 OID 186668)
-- Name: registro_2024_04; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_04 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 272 (class 1259 OID 186685)
-- Name: registro_2024_05; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_05 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 273 (class 1259 OID 186702)
-- Name: registro_2024_06; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_06 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 274 (class 1259 OID 186719)
-- Name: registro_2024_07; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_07 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 275 (class 1259 OID 186736)
-- Name: registro_2024_08; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_08 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 276 (class 1259 OID 186753)
-- Name: registro_2024_09; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_09 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 277 (class 1259 OID 186770)
-- Name: registro_2024_10; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_10 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 278 (class 1259 OID 186787)
-- Name: registro_2024_11; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_11 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 279 (class 1259 OID 186804)
-- Name: registro_2024_12; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2024_12 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 280 (class 1259 OID 186821)
-- Name: registro_2025_01; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_01 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 281 (class 1259 OID 186838)
-- Name: registro_2025_02; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_02 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 282 (class 1259 OID 186855)
-- Name: registro_2025_03; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_03 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 283 (class 1259 OID 186872)
-- Name: registro_2025_04; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_04 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 284 (class 1259 OID 186889)
-- Name: registro_2025_05; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_05 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 285 (class 1259 OID 186906)
-- Name: registro_2025_06; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_06 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 286 (class 1259 OID 186923)
-- Name: registro_2025_07; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_07 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 287 (class 1259 OID 186940)
-- Name: registro_2025_08; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_08 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 288 (class 1259 OID 186957)
-- Name: registro_2025_09; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_09 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 289 (class 1259 OID 186974)
-- Name: registro_2025_10; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_10 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 290 (class 1259 OID 186991)
-- Name: registro_2025_11; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_11 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 291 (class 1259 OID 187008)
-- Name: registro_2025_12; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2025_12 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 292 (class 1259 OID 187025)
-- Name: registro_2026_01; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_01 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 293 (class 1259 OID 187042)
-- Name: registro_2026_02; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_02 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 294 (class 1259 OID 187059)
-- Name: registro_2026_03; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_03 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 295 (class 1259 OID 187076)
-- Name: registro_2026_04; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_04 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 296 (class 1259 OID 187093)
-- Name: registro_2026_05; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_05 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 297 (class 1259 OID 187110)
-- Name: registro_2026_06; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_06 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 298 (class 1259 OID 187127)
-- Name: registro_2026_07; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_07 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 299 (class 1259 OID 187144)
-- Name: registro_2026_08; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_08 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 300 (class 1259 OID 187161)
-- Name: registro_2026_09; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_09 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 301 (class 1259 OID 187178)
-- Name: registro_2026_10; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_10 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 302 (class 1259 OID 187195)
-- Name: registro_2026_11; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_11 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 303 (class 1259 OID 187212)
-- Name: registro_2026_12; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2026_12 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 304 (class 1259 OID 187229)
-- Name: registro_2027_01; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_01 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 305 (class 1259 OID 187246)
-- Name: registro_2027_02; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_02 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 306 (class 1259 OID 187263)
-- Name: registro_2027_03; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_03 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 307 (class 1259 OID 187280)
-- Name: registro_2027_04; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_04 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 308 (class 1259 OID 187297)
-- Name: registro_2027_05; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_05 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 309 (class 1259 OID 187314)
-- Name: registro_2027_06; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_06 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 310 (class 1259 OID 187331)
-- Name: registro_2027_07; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_07 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 311 (class 1259 OID 187348)
-- Name: registro_2027_08; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_08 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 312 (class 1259 OID 187365)
-- Name: registro_2027_09; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_09 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 313 (class 1259 OID 187382)
-- Name: registro_2027_10; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_10 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 314 (class 1259 OID 187399)
-- Name: registro_2027_11; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_11 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 315 (class 1259 OID 187416)
-- Name: registro_2027_12; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_2027_12 (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 316 (class 1259 OID 187433)
-- Name: registro_audit_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

ALTER TABLE audit.registro ALTER COLUMN audit_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME audit.registro_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 317 (class 1259 OID 187434)
-- Name: registro_default; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.registro_default (
    audit_id bigint CONSTRAINT registro_audit_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT registro_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    ip_address inet,
    app_nombre text DEFAULT 'SIGEPAA'::text,
    sesion_id text,
    schema_nombre text DEFAULT 'public'::text CONSTRAINT registro_schema_nombre_not_null NOT NULL,
    tabla_nombre text CONSTRAINT registro_tabla_nombre_not_null NOT NULL,
    operacion audit.audit_operacion CONSTRAINT registro_operacion_not_null NOT NULL,
    pk_valor jsonb CONSTRAINT registro_pk_valor_not_null NOT NULL,
    datos_antes jsonb,
    datos_despues jsonb,
    campos_cambiados text[] DEFAULT '{}'::text[],
    diff_jsonb jsonb DEFAULT '{}'::jsonb,
    query_hash text,
    duracion_ms numeric(12,4),
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 10046 (class 0 OID 0)
-- Dependencies: 317
-- Name: TABLE registro_default; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON TABLE audit.registro_default IS 'Partición de seguridad. Si hay datos aquí, significa que falta crear la partición mensual correspondiente. Ejecutar audit.fn_crear_particion_mes().';


--
-- TOC entry 318 (class 1259 OID 187451)
-- Name: regla_alerta; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.regla_alerta (
    regla_id integer NOT NULL,
    codigo text NOT NULL,
    descripcion text NOT NULL,
    severidad audit.audit_severidad DEFAULT 'HIGH'::audit.audit_severidad NOT NULL,
    activa boolean DEFAULT true NOT NULL,
    tabla_objetivo text,
    operacion text,
    umbral_count integer,
    ventana_minutos integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 319 (class 1259 OID 187465)
-- Name: regla_alerta_regla_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

CREATE SEQUENCE audit.regla_alerta_regla_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10047 (class 0 OID 0)
-- Dependencies: 319
-- Name: regla_alerta_regla_id_seq; Type: SEQUENCE OWNED BY; Schema: audit; Owner: -
--

ALTER SEQUENCE audit.regla_alerta_regla_id_seq OWNED BY audit.regla_alerta.regla_id;


--
-- TOC entry 320 (class 1259 OID 187466)
-- Name: sesion; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.sesion (
    sesion_log_id bigint NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
)
PARTITION BY RANGE (audit_timestamp);


--
-- TOC entry 321 (class 1259 OID 187474)
-- Name: sesion_2026_04; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.sesion_2026_04 (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 322 (class 1259 OID 187484)
-- Name: sesion_2026_05; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.sesion_2026_05 (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 323 (class 1259 OID 187494)
-- Name: sesion_2026_06; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.sesion_2026_06 (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 324 (class 1259 OID 187504)
-- Name: sesion_2026_07; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.sesion_2026_07 (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 325 (class 1259 OID 187514)
-- Name: sesion_default; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.sesion_default (
    sesion_log_id bigint CONSTRAINT sesion_sesion_log_id_not_null NOT NULL,
    audit_timestamp timestamp with time zone DEFAULT now() CONSTRAINT sesion_audit_timestamp_not_null NOT NULL,
    usuario_id uuid,
    usuario_nombre text,
    evento text CONSTRAINT sesion_evento_not_null NOT NULL,
    ip_address inet,
    user_agent text,
    motivo_fallo text,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 326 (class 1259 OID 187524)
-- Name: sesion_sesion_log_id_seq; Type: SEQUENCE; Schema: audit; Owner: -
--

ALTER TABLE audit.sesion ALTER COLUMN sesion_log_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME audit.sesion_sesion_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 327 (class 1259 OID 187525)
-- Name: tabla_config; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.tabla_config (
    tabla_nombre text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    nivel audit.audit_nivel DEFAULT 'STANDARD'::audit.audit_nivel NOT NULL,
    columnas_excluidas text[] DEFAULT ARRAY[]::text[] NOT NULL,
    columnas_enmascarar text[] DEFAULT ARRAY[]::text[] NOT NULL,
    auditar_insert boolean DEFAULT true NOT NULL,
    auditar_update boolean DEFAULT true NOT NULL,
    auditar_delete boolean DEFAULT true NOT NULL,
    retener_dias integer,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT tabla_config_retener_dias_check CHECK ((retener_dias > 0))
);


--
-- TOC entry 10048 (class 0 OID 0)
-- Dependencies: 327
-- Name: TABLE tabla_config; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON TABLE audit.tabla_config IS 'Configuración por tabla del sistema de auditoría. Controla nivel de detalle, columnas sensibles, operaciones y retención.';


--
-- TOC entry 328 (class 1259 OID 187550)
-- Name: usuario_refresh_tokens; Type: TABLE; Schema: audit; Owner: -
--

CREATE TABLE audit.usuario_refresh_tokens (
    token_id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    token_hash text NOT NULL,
    jti uuid NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked boolean DEFAULT false NOT NULL,
    revoked_at timestamp with time zone,
    ip_address inet,
    device_info text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 329 (class 1259 OID 187567)
-- Name: vw_accesos_recientes; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_accesos_recientes AS
 SELECT sesion_log_id,
    audit_timestamp,
    usuario_id,
    usuario_nombre,
    evento,
    ip_address,
    user_agent,
    motivo_fallo,
    metadata
   FROM audit.sesion s
  ORDER BY audit_timestamp DESC;


--
-- TOC entry 10049 (class 0 OID 0)
-- Dependencies: 329
-- Name: VIEW vw_accesos_recientes; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_accesos_recientes IS 'Feed cronológico de todos los inicios y cierres de sesión, además de fallos. Esencial para auditoría de acceso e identificación de ataques de fuerza bruta.';


--
-- TOC entry 330 (class 1259 OID 187571)
-- Name: vw_actividad_usuario; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_actividad_usuario AS
 SELECT usuario_id,
    usuario_nombre,
    count(*) AS total_eventos,
    count(*) FILTER (WHERE (operacion = 'INSERT'::audit.audit_operacion)) AS inserts,
    count(*) FILTER (WHERE (operacion = 'UPDATE'::audit.audit_operacion)) AS updates,
    count(*) FILTER (WHERE (operacion = 'DELETE'::audit.audit_operacion)) AS deletes,
    count(DISTINCT tabla_nombre) AS tablas_afectadas,
    array_agg(DISTINCT tabla_nombre ORDER BY tabla_nombre) AS tablas,
    count(DISTINCT (ip_address)::text) AS ips_distintas,
    min(audit_timestamp) AS primera_accion,
    max(audit_timestamp) AS ultima_accion,
    (max(audit_timestamp) - min(audit_timestamp)) AS duracion_sesion
   FROM audit.registro
  WHERE (audit_timestamp > (now() - '24:00:00'::interval))
  GROUP BY usuario_id, usuario_nombre
  ORDER BY (count(*)) DESC;


--
-- TOC entry 10050 (class 0 OID 0)
-- Dependencies: 330
-- Name: VIEW vw_actividad_usuario; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_actividad_usuario IS 'Resumen de actividad por usuario en las últimas 24 horas. Útil para detectar patrones de uso anómalos.';


--
-- TOC entry 331 (class 1259 OID 187576)
-- Name: vw_alertas_activas; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_alertas_activas AS
 SELECT alerta_id,
    tipo_alerta,
    severidad,
    descripcion,
    tabla_nombre,
    usuario_id,
    usuario_nombre,
    array_length(audit_ids, 1) AS num_eventos,
    created_at,
    (EXTRACT(epoch FROM (now() - created_at)) / (60)::numeric) AS minutos_transcurridos,
    metadata
   FROM audit.alerta a
  WHERE (resuelta = false)
  ORDER BY
        CASE severidad
            WHEN 'CRITICAL'::audit.audit_severidad THEN 1
            WHEN 'HIGH'::audit.audit_severidad THEN 2
            WHEN 'MEDIUM'::audit.audit_severidad THEN 3
            WHEN 'LOW'::audit.audit_severidad THEN 4
            ELSE NULL::integer
        END, created_at DESC;


--
-- TOC entry 10051 (class 0 OID 0)
-- Dependencies: 331
-- Name: VIEW vw_alertas_activas; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_alertas_activas IS 'Alertas de seguridad pendientes de resolución, ordenadas por severidad. Para resolver: SELECT audit.fn_resolver_alerta(alerta_id, usuario_id, nota);';


--
-- TOC entry 332 (class 1259 OID 187581)
-- Name: vw_cambios_recientes; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_cambios_recientes AS
 SELECT audit_id,
    audit_timestamp,
    tabla_nombre,
    operacion,
    usuario_id,
    usuario_nombre,
    ip_address,
    sesion_id,
    pk_valor,
    campos_cambiados,
    diff_jsonb,
    COALESCE(array_length(campos_cambiados, 1), 0) AS num_campos_cambiados,
    duracion_ms,
    metadata
   FROM audit.registro r
  ORDER BY audit_timestamp DESC;


--
-- TOC entry 10052 (class 0 OID 0)
-- Dependencies: 332
-- Name: VIEW vw_cambios_recientes; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_cambios_recientes IS 'Feed cronológico descendente de todos los cambios auditados. Limitar con LIMIT/WHERE para evitar scans completos.';


--
-- TOC entry 333 (class 1259 OID 187585)
-- Name: vw_cambios_sensibles; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_cambios_sensibles AS
 SELECT audit_id,
    audit_timestamp,
    tabla_nombre,
    operacion,
    usuario_id,
    usuario_nombre,
    ip_address,
    pk_valor,
    campos_cambiados,
    diff_jsonb
   FROM audit.registro r
  WHERE (tabla_nombre = ANY (ARRAY['usuarios'::text, 'cliente_usuario'::text, 'usuario_roles'::text, 'usuario_permisos'::text, 'roles'::text, 'rol_permisos'::text, 'permisos'::text, 'tarifa'::text, 'rangos_variables'::text, 'componentes_fijos'::text, 'empleados'::text]))
  ORDER BY audit_timestamp DESC;


--
-- TOC entry 10053 (class 0 OID 0)
-- Dependencies: 333
-- Name: VIEW vw_cambios_sensibles; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_cambios_sensibles IS 'Filtro solo de tablas de alta criticidad: seguridad, tarifas, RRHH. Para compliance y revisión de auditoría focalizada.';


--
-- TOC entry 334 (class 1259 OID 187590)
-- Name: vw_config_resumen; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_config_resumen AS
 SELECT tabla_nombre,
    activo,
    nivel,
    COALESCE(array_length(columnas_enmascarar, 1), 0) AS cols_enmascaradas,
    COALESCE(array_length(columnas_excluidas, 1), 0) AS cols_excluidas,
    auditar_insert,
    auditar_update,
    auditar_delete,
    retener_dias,
        CASE
            WHEN (retener_dias IS NULL) THEN 'política global'::text
            ELSE ((((retener_dias)::numeric / 365.0))::numeric(5,1) || ' años'::text)
        END AS retencion_descripcion
   FROM audit.tabla_config
  ORDER BY nivel DESC, tabla_nombre;


--
-- TOC entry 10054 (class 0 OID 0)
-- Dependencies: 334
-- Name: VIEW vw_config_resumen; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_config_resumen IS 'Vista de resumen de la configuración de auditoría por tabla.';


--
-- TOC entry 335 (class 1259 OID 187595)
-- Name: vw_estadisticas_generales; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_estadisticas_generales AS
 SELECT ( SELECT count(*) AS count
           FROM audit.registro) AS total_eventos_historico,
    ( SELECT count(*) AS count
           FROM audit.registro
          WHERE (registro.audit_timestamp > (now() - '24:00:00'::interval))) AS eventos_24h,
    ( SELECT count(*) AS count
           FROM audit.registro
          WHERE (registro.audit_timestamp > (now() - '7 days'::interval))) AS eventos_7d,
    ( SELECT count(*) AS count
           FROM audit.registro
          WHERE (registro.audit_timestamp > (now() - '30 days'::interval))) AS eventos_30d,
    ( SELECT count(*) AS count
           FROM audit.alerta
          WHERE (alerta.resuelta = false)) AS alertas_pendientes,
    ( SELECT count(*) AS count
           FROM audit.alerta
          WHERE ((alerta.resuelta = false) AND (alerta.severidad = 'CRITICAL'::audit.audit_severidad))) AS alertas_criticas,
    ( SELECT count(*) AS count
           FROM audit.tabla_config
          WHERE (tabla_config.activo = true)) AS tablas_auditadas,
    ( SELECT count(*) AS count
           FROM audit.tabla_config
          WHERE (tabla_config.activo = false)) AS tablas_pausadas,
    ( SELECT max(registro.audit_timestamp) AS max
           FROM audit.registro) AS ultimo_evento,
    ( SELECT max(alerta.created_at) AS max
           FROM audit.alerta) AS ultima_alerta,
    (( SELECT count(*) AS count
           FROM pg_tables
          WHERE ((pg_tables.schemaname = 'audit'::name) AND (pg_tables.tablename ~~ 'registro_%'::text))))::integer AS particiones_totales,
    now() AS generado_en;


--
-- TOC entry 10055 (class 0 OID 0)
-- Dependencies: 335
-- Name: VIEW vw_estadisticas_generales; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_estadisticas_generales IS 'KPIs globales del sistema de auditoría. Usar para el dashboard de monitoreo de seguridad.';


--
-- TOC entry 336 (class 1259 OID 187600)
-- Name: vw_estado_triggers; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_estado_triggers AS
 SELECT tc.tabla_nombre,
    tc.activo AS config_activa,
    tc.nivel,
        CASE
            WHEN (t.trigger_name IS NOT NULL) THEN true
            ELSE false
        END AS trigger_existe,
    t.trigger_name,
    t.event_manipulation,
    t.action_timing
   FROM (audit.tabla_config tc
     LEFT JOIN information_schema.triggers t ON ((((t.trigger_schema)::name = 'public'::name) AND ((t.event_object_table)::name = tc.tabla_nombre) AND ((t.trigger_name)::name = ('trg_audit_'::text || tc.tabla_nombre)))))
  WHERE (((t.event_manipulation)::text = 'INSERT'::text) OR (t.event_manipulation IS NULL))
  ORDER BY tc.tabla_nombre;


--
-- TOC entry 10056 (class 0 OID 0)
-- Dependencies: 336
-- Name: VIEW vw_estado_triggers; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_estado_triggers IS 'Estado actual de los triggers de auditoría. Si trigger_existe = FALSE pero config_activa = TRUE, ejecutar fn_aplicar_triggers().';


--
-- TOC entry 337 (class 1259 OID 187605)
-- Name: vw_historial_fila; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_historial_fila AS
 SELECT audit_id,
    audit_timestamp,
    tabla_nombre AS tabla,
    pk_valor AS pk,
    operacion,
    usuario_id,
    usuario_nombre,
    ip_address,
    campos_cambiados,
    diff_jsonb,
    datos_antes,
    datos_despues,
    duracion_ms
   FROM audit.registro r
  ORDER BY tabla_nombre, pk_valor, audit_timestamp;


--
-- TOC entry 10057 (class 0 OID 0)
-- Dependencies: 337
-- Name: VIEW vw_historial_fila; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_historial_fila IS 'Historial completo de cambios agrupado por tabla y PK. Filtrar por tabla_nombre y pk_valor para ver el historial de un registro. Ejemplo: SELECT * FROM audit.vw_historial_fila WHERE tabla = ''acometida'' AND pk = ''{"acometida_id": "0001-001"}'';';


--
-- TOC entry 338 (class 1259 OID 187609)
-- Name: vw_permisos; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_permisos AS
 SELECT grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable
   FROM information_schema.role_table_grants
  WHERE ((table_schema)::name = 'audit'::name)
  ORDER BY grantee, table_name, privilege_type;


--
-- TOC entry 10058 (class 0 OID 0)
-- Dependencies: 338
-- Name: VIEW vw_permisos; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_permisos IS 'Permisos actuales sobre objetos del schema audit. Usar para verificar la correcta configuración de seguridad.';


--
-- TOC entry 339 (class 1259 OID 187613)
-- Name: vw_resumen_accesos; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_resumen_accesos AS
 SELECT (date_trunc('day'::text, audit_timestamp))::date AS fecha,
    evento,
    count(*) AS total,
    count(DISTINCT usuario_nombre) AS usuarios_unicos,
    count(DISTINCT ip_address) AS ips_distintas
   FROM audit.sesion
  WHERE (audit_timestamp > (now() - '7 days'::interval))
  GROUP BY ((date_trunc('day'::text, audit_timestamp))::date), evento
  ORDER BY ((date_trunc('day'::text, audit_timestamp))::date) DESC, evento;


--
-- TOC entry 10059 (class 0 OID 0)
-- Dependencies: 339
-- Name: VIEW vw_resumen_accesos; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_resumen_accesos IS 'Resumen diario de eventos de sesión de los últimos 7 días. Permite visualizar picos de uso o de fallos de autenticación.';


--
-- TOC entry 340 (class 1259 OID 187617)
-- Name: vw_resumen_diario; Type: VIEW; Schema: audit; Owner: -
--

CREATE VIEW audit.vw_resumen_diario AS
 SELECT (date_trunc('day'::text, audit_timestamp))::date AS fecha,
    tabla_nombre,
    operacion,
    count(*) AS total,
    count(DISTINCT usuario_id) AS usuarios_unicos,
    round(avg(duracion_ms), 3) AS duracion_prom_ms,
    round(max(duracion_ms), 3) AS duracion_max_ms
   FROM audit.registro
  WHERE (audit_timestamp > (now() - '30 days'::interval))
  GROUP BY ((date_trunc('day'::text, audit_timestamp))::date), tabla_nombre, operacion
  ORDER BY ((date_trunc('day'::text, audit_timestamp))::date) DESC, (count(*)) DESC;


--
-- TOC entry 10060 (class 0 OID 0)
-- Dependencies: 340
-- Name: VIEW vw_resumen_diario; Type: COMMENT; Schema: audit; Owner: -
--

COMMENT ON VIEW audit.vw_resumen_diario IS 'Estadísticas diarias de auditoría por tabla y operación (últimos 30 días). Útil para dashboards y reportes de compliance.';


--
-- TOC entry 341 (class 1259 OID 187622)
-- Name: acometida; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.acometida (
    acometida_id character varying(10) NOT NULL,
    cliente_id character varying(13) NOT NULL,
    tarifa_id integer NOT NULL,
    numero_medidor character varying(20),
    sector integer NOT NULL,
    cuenta integer NOT NULL,
    clave_catastral character varying(10) NOT NULL,
    numero_contrato character varying(20),
    alcantarillado boolean NOT NULL,
    estado boolean,
    observaciones character varying(255),
    direccion character varying(255),
    fecha_instalacion timestamp without time zone,
    numero_personas integer,
    zona integer,
    coordenadas public.geometry(Point,4326),
    referencia character varying(255),
    metadata jsonb,
    altitud double precision,
    "precision" double precision,
    fecha_geolocalizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    zona_geometrica public.geometry(Polygon,4326),
    predio_clave_catastral character varying(25),
    fecha_inicio_lecturas date,
    zona_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    estado_id integer
);


--
-- TOC entry 513 (class 1259 OID 190801)
-- Name: auditoria_lectura_sector; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auditoria_lectura_sector (
    audit_id integer NOT NULL,
    mes_lectura date NOT NULL,
    sector_id integer NOT NULL,
    total_esperado integer DEFAULT 0,
    total_completadas integer DEFAULT 0,
    total_pendientes integer GENERATED ALWAYS AS (
CASE
    WHEN ((total_esperado - total_completadas) < 0) THEN 0
    ELSE (total_esperado - total_completadas)
END) STORED,
    avance_porcentaje numeric(5,2) GENERATED ALWAYS AS (
CASE
    WHEN (total_esperado > 0) THEN LEAST((((total_completadas)::numeric / (total_esperado)::numeric) * (100)::numeric), (100)::numeric)
    ELSE (0)::numeric
END) STORED,
    completo boolean DEFAULT false,
    fecha_cierre timestamp with time zone,
    usuario_supervisor_id uuid,
    observaciones text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 512 (class 1259 OID 190800)
-- Name: auditoria_lectura_sector_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auditoria_lectura_sector_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10061 (class 0 OID 0)
-- Dependencies: 512
-- Name: auditoria_lectura_sector_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auditoria_lectura_sector_audit_id_seq OWNED BY public.auditoria_lectura_sector.audit_id;


--
-- TOC entry 342 (class 1259 OID 187639)
-- Name: canton; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.canton (
    canton_id character varying(8) NOT NULL,
    nombre character varying(100) NOT NULL,
    provincia_id character varying(8) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 343 (class 1259 OID 187649)
-- Name: cargo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cargo (
    cargo_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    nivel_jerarquico smallint DEFAULT 0,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 344 (class 1259 OID 187662)
-- Name: cargo_cargo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cargo_cargo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10062 (class 0 OID 0)
-- Dependencies: 344
-- Name: cargo_cargo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cargo_cargo_id_seq OWNED BY public.cargo.cargo_id;


--
-- TOC entry 509 (class 1259 OID 190677)
-- Name: cat_estados_acometida; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cat_estados_acometida (
    id_estado integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    permite_facturar boolean DEFAULT true,
    requiere_inspeccion boolean DEFAULT false,
    permite_lectura boolean DEFAULT true
);


--
-- TOC entry 345 (class 1259 OID 187663)
-- Name: categoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoria (
    categoria_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 346 (class 1259 OID 187674)
-- Name: categoria_categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categoria_categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10063 (class 0 OID 0)
-- Dependencies: 346
-- Name: categoria_categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categoria_categoria_id_seq OWNED BY public.categoria.categoria_id;


--
-- TOC entry 347 (class 1259 OID 187675)
-- Name: ciudadano; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ciudadano (
    ciudadano_id character varying(10) NOT NULL,
    nombres character varying(100) DEFAULT 'SIN NOMBRE'::character varying,
    apellidos character varying(100) DEFAULT 'SIN APELLIDO'::character varying,
    fecha_nacimiento date,
    fallecido boolean DEFAULT false NOT NULL,
    sexo_id integer NOT NULL,
    estado_civil_id integer NOT NULL,
    profesion_id integer NOT NULL,
    parroquia_id character varying(10) NOT NULL,
    direccion character varying(255) DEFAULT 'SIN DIRECCION'::character varying,
    pais_origen character varying(100),
    updated_at timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 348 (class 1259 OID 187692)
-- Name: claves_sql2000; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.claves_sql2000 (
    id integer NOT NULL,
    clave_catastral character varying(15) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 349 (class 1259 OID 187701)
-- Name: claves_sql2000_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.claves_sql2000_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10064 (class 0 OID 0)
-- Dependencies: 349
-- Name: claves_sql2000_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.claves_sql2000_id_seq OWNED BY public.claves_sql2000.id;


--
-- TOC entry 350 (class 1259 OID 187702)
-- Name: cliente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cliente (
    cliente_id character varying(13) NOT NULL,
    tipo_identificacion_id character varying(5) NOT NULL,
    cliente_id_valido character varying(20) NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 351 (class 1259 OID 187718)
-- Name: correo_electronico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.correo_electronico (
    correo_electronico_id integer NOT NULL,
    email character varying(150) CONSTRAINT correo_electronico_correo_not_null NOT NULL,
    cliente_id character varying(13) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 352 (class 1259 OID 187728)
-- Name: telefono; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.telefono (
    telefono_id integer NOT NULL,
    cliente_id character varying(13) NOT NULL,
    numero character varying(20) NOT NULL,
    tipo_telefono_id integer NOT NULL,
    es_valido boolean DEFAULT false CONSTRAINT telefono_es_validado_not_null NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 353 (class 1259 OID 187741)
-- Name: cliente_contacto; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.cliente_contacto AS
 SELECT c.cliente_id,
    COALESCE(json_agg(DISTINCT jsonb_build_object('telefono_id', t.telefono_id, 'numero', t.numero)) FILTER (WHERE (t.telefono_id IS NOT NULL)), '[]'::json) AS phones,
    COALESCE(json_agg(DISTINCT jsonb_build_object('correo_electronico_id', ce.correo_electronico_id, 'correo', ce.email)) FILTER (WHERE (ce.correo_electronico_id IS NOT NULL)), '[]'::json) AS correos
   FROM ((public.cliente c
     LEFT JOIN public.telefono t ON (((t.cliente_id)::text = (c.cliente_id)::text)))
     LEFT JOIN public.correo_electronico ce ON (((ce.cliente_id)::text = (c.cliente_id)::text)))
  GROUP BY c.cliente_id;


--
-- TOC entry 354 (class 1259 OID 187746)
-- Name: cliente_persona_natural; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cliente_persona_natural (
    cliente_persona_natural_id integer NOT NULL,
    ciudadano_id character varying(10) NOT NULL,
    cliente_id character varying(13) NOT NULL,
    direccion_acometida character varying(255) DEFAULT 'SIN DIRECCION'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 355 (class 1259 OID 187758)
-- Name: cliente_persona_natural_cliente_persona_natural_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cliente_persona_natural_cliente_persona_natural_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10065 (class 0 OID 0)
-- Dependencies: 355
-- Name: cliente_persona_natural_cliente_persona_natural_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cliente_persona_natural_cliente_persona_natural_id_seq OWNED BY public.cliente_persona_natural.cliente_persona_natural_id;


--
-- TOC entry 356 (class 1259 OID 187759)
-- Name: cliente_usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cliente_usuario (
    cliente_usuario_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cliente_id character varying(13) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255),
    auth_method character varying(50) DEFAULT 'PASSWORD'::character varying NOT NULL,
    auth_provider character varying(50),
    estado_cliente_usuario_id integer DEFAULT 2 NOT NULL,
    is_active boolean GENERATED ALWAYS AS ((estado_cliente_usuario_id = 1)) STORED NOT NULL,
    fecha_registro timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_ultimo_acceso timestamp with time zone,
    failed_attempts integer DEFAULT 0,
    lockout_until timestamp with time zone,
    is_locked_out boolean DEFAULT false NOT NULL,
    two_factor_enabled boolean DEFAULT false,
    two_factor_secret character varying(255),
    two_factor_backup_codes text[],
    email_verified boolean DEFAULT false,
    telefono_verified boolean DEFAULT false,
    verification_token character varying(255),
    verification_expiry timestamp with time zone,
    reset_token character varying(255),
    reset_token_expiry timestamp with time zone,
    preferencias jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone,
    CONSTRAINT chk_reset_expiry CHECK (((reset_token_expiry IS NULL) OR (reset_token_expiry > CURRENT_TIMESTAMP))),
    CONSTRAINT cliente_usuario_failed_attempts_check CHECK ((failed_attempts >= 0))
);


--
-- TOC entry 357 (class 1259 OID 187786)
-- Name: componentes_fijos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.componentes_fijos (
    id integer NOT NULL,
    tarifa_id integer NOT NULL,
    servicio_id integer,
    componente_nombre character varying(100) NOT NULL,
    valor numeric(10,4) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 358 (class 1259 OID 187797)
-- Name: componentes_fijos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.componentes_fijos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10066 (class 0 OID 0)
-- Dependencies: 358
-- Name: componentes_fijos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.componentes_fijos_id_seq OWNED BY public.componentes_fijos.id;


--
-- TOC entry 359 (class 1259 OID 187798)
-- Name: consumo_promedio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consumo_promedio (
    acometida_id character varying(50) NOT NULL,
    average_consumption numeric(18,2) NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    lecturas_usadas integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 360 (class 1259 OID 187807)
-- Name: correo_electronico_correo_electronico_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.correo_electronico_correo_electronico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10067 (class 0 OID 0)
-- Dependencies: 360
-- Name: correo_electronico_correo_electronico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.correo_electronico_correo_electronico_id_seq OWNED BY public.correo_electronico.correo_electronico_id;


--
-- TOC entry 361 (class 1259 OID 187808)
-- Name: correo_empresa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.correo_empresa (
    correo_empresa_id integer NOT NULL,
    correo_electronico_id integer NOT NULL,
    empresa_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 362 (class 1259 OID 187818)
-- Name: correo_empresa_correo_empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.correo_empresa_correo_empresa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10068 (class 0 OID 0)
-- Dependencies: 362
-- Name: correo_empresa_correo_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.correo_empresa_correo_empresa_id_seq OWNED BY public.correo_empresa.correo_empresa_id;


--
-- TOC entry 363 (class 1259 OID 187819)
-- Name: correo_persona_natural; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.correo_persona_natural (
    correo_persona_natural_id integer NOT NULL,
    correo_electronico_id integer NOT NULL,
    cliente_persona_natural_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 364 (class 1259 OID 187829)
-- Name: correo_persona_natural_correo_persona_natural_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.correo_persona_natural_correo_persona_natural_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10069 (class 0 OID 0)
-- Dependencies: 364
-- Name: correo_persona_natural_correo_persona_natural_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.correo_persona_natural_correo_persona_natural_id_seq OWNED BY public.correo_persona_natural.correo_persona_natural_id;


--
-- TOC entry 365 (class 1259 OID 187830)
-- Name: direccion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.direccion (
    direccion_id integer NOT NULL,
    calle_principal character varying(100) NOT NULL,
    calle_secundaria character varying(100),
    numero character varying(20),
    parroquia_id character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 366 (class 1259 OID 187840)
-- Name: direccion_direccion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.direccion_direccion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10070 (class 0 OID 0)
-- Dependencies: 366
-- Name: direccion_direccion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.direccion_direccion_id_seq OWNED BY public.direccion.direccion_id;


--
-- TOC entry 367 (class 1259 OID 187841)
-- Name: empleado_zona; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empleado_zona (
    empleado_id uuid NOT NULL,
    zona_id integer NOT NULL,
    fecha_asignacion date DEFAULT CURRENT_DATE,
    fecha_fin date,
    es_principal boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 368 (class 1259 OID 187852)
-- Name: empleados; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empleados (
    empleado_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    usuario_id uuid NOT NULL,
    ciudadano_id character varying(10),
    cedula character varying(10),
    nombres character varying(100) DEFAULT 'SIN NOMBRE'::character varying NOT NULL,
    apellidos character varying(100) DEFAULT 'SIN APELLIDO'::character varying NOT NULL,
    fecha_nacimiento date,
    sexo_id integer,
    cargo_id integer NOT NULL,
    tipo_contrato_id integer NOT NULL,
    estado_empleado_id integer DEFAULT 1 NOT NULL,
    fecha_ingreso date NOT NULL,
    fecha_salida date,
    salario_base numeric(12,2),
    supervisor_id uuid,
    zonas_asignadas integer[],
    licencia_conducir character varying(20),
    tiene_vehiculo_empresa boolean DEFAULT false,
    telefono_interno character varying(20),
    email_interno character varying(150),
    foto_url character varying(255),
    metadata jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone,
    CONSTRAINT chk_fecha_salida CHECK (((fecha_salida IS NULL) OR (fecha_salida > fecha_ingreso)))
);


--
-- TOC entry 369 (class 1259 OID 187873)
-- Name: empresa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empresa (
    empresa_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre_comercial character varying(255),
    razon_social character varying(255),
    ruc character varying(13),
    direccion character varying(255) DEFAULT 'SIN DIRECCION'::character varying,
    parroquia_id character varying(10) NOT NULL,
    cliente_id character varying(13) NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pais character varying(100),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 370 (class 1259 OID 187891)
-- Name: estado_civil; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estado_civil (
    estado_civil_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 371 (class 1259 OID 187900)
-- Name: estado_civil_estado_civil_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estado_civil_estado_civil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10071 (class 0 OID 0)
-- Dependencies: 371
-- Name: estado_civil_estado_civil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estado_civil_estado_civil_id_seq OWNED BY public.estado_civil.estado_civil_id;


--
-- TOC entry 372 (class 1259 OID 187901)
-- Name: estado_cliente_usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estado_cliente_usuario (
    estado_cliente_usuario_id integer NOT NULL,
    codigo character varying(30) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    permite_login boolean DEFAULT true NOT NULL,
    requiere_verificacion boolean DEFAULT false,
    color_ui character varying(20) DEFAULT '#000000'::character varying,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 373 (class 1259 OID 187918)
-- Name: estado_cliente_usuario_estado_cliente_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estado_cliente_usuario_estado_cliente_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10072 (class 0 OID 0)
-- Dependencies: 373
-- Name: estado_cliente_usuario_estado_cliente_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estado_cliente_usuario_estado_cliente_usuario_id_seq OWNED BY public.estado_cliente_usuario.estado_cliente_usuario_id;


--
-- TOC entry 374 (class 1259 OID 187919)
-- Name: estado_empleado; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estado_empleado (
    estado_empleado_id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    permite_acceso_sistema boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 375 (class 1259 OID 187932)
-- Name: estado_empleado_estado_empleado_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estado_empleado_estado_empleado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10073 (class 0 OID 0)
-- Dependencies: 375
-- Name: estado_empleado_estado_empleado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estado_empleado_estado_empleado_id_seq OWNED BY public.estado_empleado.estado_empleado_id;


--
-- TOC entry 376 (class 1259 OID 187933)
-- Name: estado_pago; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estado_pago (
    estado_pago_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 377 (class 1259 OID 187942)
-- Name: estado_pago_estado_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estado_pago_estado_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10074 (class 0 OID 0)
-- Dependencies: 377
-- Name: estado_pago_estado_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estado_pago_estado_pago_id_seq OWNED BY public.estado_pago.estado_pago_id;


--
-- TOC entry 378 (class 1259 OID 187943)
-- Name: factura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.factura (
    factura_id integer NOT NULL,
    cliente_id character varying(13) NOT NULL,
    forma_pago_id integer NOT NULL,
    estado_pago_id integer NOT NULL,
    numero_factura character varying(20) NOT NULL,
    fecha_pago timestamp without time zone,
    fecha_vencimiento timestamp without time zone NOT NULL,
    numero_serie character varying(20) NOT NULL,
    generado_xml boolean DEFAULT false NOT NULL,
    numero_xml character varying(20),
    valor_factura numeric(18,2) NOT NULL,
    iva numeric(18,2) NOT NULL,
    sub_total numeric(18,2) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 379 (class 1259 OID 187964)
-- Name: factura_factura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.factura_factura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10075 (class 0 OID 0)
-- Dependencies: 379
-- Name: factura_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.factura_factura_id_seq OWNED BY public.factura.factura_id;


--
-- TOC entry 380 (class 1259 OID 187965)
-- Name: forma_pago; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.forma_pago (
    forma_pago_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 381 (class 1259 OID 187974)
-- Name: forma_pago_forma_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.forma_pago_forma_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10076 (class 0 OID 0)
-- Dependencies: 381
-- Name: forma_pago_forma_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.forma_pago_forma_pago_id_seq OWNED BY public.forma_pago.forma_pago_id;


--
-- TOC entry 382 (class 1259 OID 187975)
-- Name: foto_acometida; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.foto_acometida (
    foto_acometida_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    imagen_url character varying(255) NOT NULL,
    descripcion character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 383 (class 1259 OID 187987)
-- Name: foto_acometida_foto_acometida_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.foto_acometida_foto_acometida_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10077 (class 0 OID 0)
-- Dependencies: 383
-- Name: foto_acometida_foto_acometida_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.foto_acometida_foto_acometida_id_seq OWNED BY public.foto_acometida.foto_acometida_id;


--
-- TOC entry 384 (class 1259 OID 187988)
-- Name: foto_lectura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.foto_lectura (
    foto_lectura_id integer NOT NULL,
    lectura_id integer NOT NULL,
    imagen_url character varying(255) NOT NULL,
    clave_catastral character varying(10) NOT NULL,
    descripcion character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 385 (class 1259 OID 188001)
-- Name: foto_lectura_foto_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.foto_lectura_foto_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10078 (class 0 OID 0)
-- Dependencies: 385
-- Name: foto_lectura_foto_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.foto_lectura_foto_lectura_id_seq OWNED BY public.foto_lectura.foto_lectura_id;


--
-- TOC entry 511 (class 1259 OID 190691)
-- Name: historial_estados_acometida; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.historial_estados_acometida (
    id integer NOT NULL,
    acometida_id character varying(15),
    estado_id integer,
    fecha_cambio timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_id uuid,
    motivo text,
    activo boolean DEFAULT true,
    detalles_tecnicos jsonb DEFAULT '{}'::jsonb
);


--
-- TOC entry 510 (class 1259 OID 190690)
-- Name: historial_estados_acometida_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.historial_estados_acometida_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10079 (class 0 OID 0)
-- Dependencies: 510
-- Name: historial_estados_acometida_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.historial_estados_acometida_id_seq OWNED BY public.historial_estados_acometida.id;


--
-- TOC entry 386 (class 1259 OID 188002)
-- Name: lectura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lectura (
    lectura_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    fecha_lectura timestamp without time zone DEFAULT now(),
    hora_lectura time without time zone DEFAULT (now())::time without time zone,
    sector integer NOT NULL,
    cuenta integer NOT NULL,
    clave_catastral character varying(10) NOT NULL,
    valor_lectura numeric(18,2),
    tasa_alcantarillado numeric(18,2),
    lectura_anterior numeric(10,2),
    lectura_actual numeric(10,2),
    codigo_ingreso_renta integer,
    novedad character varying(255),
    codigo_ingreso integer,
    tipo_novedad_lectura_id integer,
    lectura_estado_id integer,
    observacion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    mes_lectura character(7)
);


--
-- TOC entry 387 (class 1259 OID 188018)
-- Name: lectura_estado; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lectura_estado (
    lectura_estado_id integer NOT NULL,
    codigo character varying(20) NOT NULL,
    tipo_estado_lectura_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    activo boolean DEFAULT true NOT NULL,
    orden smallint DEFAULT 0 NOT NULL,
    es_inicial boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 388 (class 1259 OID 188035)
-- Name: lectura_estado_lectura_estado_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lectura_estado_lectura_estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10080 (class 0 OID 0)
-- Dependencies: 388
-- Name: lectura_estado_lectura_estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lectura_estado_lectura_estado_id_seq OWNED BY public.lectura_estado.lectura_estado_id;


--
-- TOC entry 389 (class 1259 OID 188036)
-- Name: lectura_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lectura_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10081 (class 0 OID 0)
-- Dependencies: 389
-- Name: lectura_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lectura_lectura_id_seq OWNED BY public.lectura.lectura_id;


--
-- TOC entry 390 (class 1259 OID 188037)
-- Name: observacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.observacion (
    observacion_id integer NOT NULL,
    titulo_observacion character varying(100) NOT NULL,
    detalle_observacion character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 391 (class 1259 OID 188047)
-- Name: observacion_acometida; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.observacion_acometida (
    observacion_acometida_id integer NOT NULL,
    observacion_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 392 (class 1259 OID 188059)
-- Name: observacion_acometida_observacion_acometida_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.observacion_acometida_observacion_acometida_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10082 (class 0 OID 0)
-- Dependencies: 392
-- Name: observacion_acometida_observacion_acometida_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.observacion_acometida_observacion_acometida_id_seq OWNED BY public.observacion_acometida.observacion_acometida_id;


--
-- TOC entry 393 (class 1259 OID 188060)
-- Name: observacion_factura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.observacion_factura (
    observacion_factura_id integer NOT NULL,
    observacion_id integer NOT NULL,
    factura_id integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 394 (class 1259 OID 188072)
-- Name: observacion_factura_observacion_factura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.observacion_factura_observacion_factura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10083 (class 0 OID 0)
-- Dependencies: 394
-- Name: observacion_factura_observacion_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.observacion_factura_observacion_factura_id_seq OWNED BY public.observacion_factura.observacion_factura_id;


--
-- TOC entry 395 (class 1259 OID 188073)
-- Name: observacion_lectura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.observacion_lectura (
    observacion_lectura_id integer NOT NULL,
    observacion_id integer NOT NULL,
    lectura_id integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 396 (class 1259 OID 188085)
-- Name: observacion_lectura_observacion_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.observacion_lectura_observacion_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10084 (class 0 OID 0)
-- Dependencies: 396
-- Name: observacion_lectura_observacion_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.observacion_lectura_observacion_lectura_id_seq OWNED BY public.observacion_lectura.observacion_lectura_id;


--
-- TOC entry 397 (class 1259 OID 188086)
-- Name: observacion_observacion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.observacion_observacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10085 (class 0 OID 0)
-- Dependencies: 397
-- Name: observacion_observacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.observacion_observacion_id_seq OWNED BY public.observacion.observacion_id;


--
-- TOC entry 398 (class 1259 OID 188087)
-- Name: pais; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pais (
    pais_id character varying(3) NOT NULL,
    nombre character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 399 (class 1259 OID 188096)
-- Name: parroquia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parroquia (
    parroquia_id character varying(10) NOT NULL,
    nombre character varying(100) NOT NULL,
    canton_id character varying(8) NOT NULL,
    tipo_parroquia_id character varying(5) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 400 (class 1259 OID 188107)
-- Name: permiso_categoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permiso_categoria (
    categoria_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 401 (class 1259 OID 188118)
-- Name: permiso_categoria_categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permiso_categoria_categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10086 (class 0 OID 0)
-- Dependencies: 401
-- Name: permiso_categoria_categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permiso_categoria_categoria_id_seq OWNED BY public.permiso_categoria.categoria_id;


--
-- TOC entry 402 (class 1259 OID 188119)
-- Name: permisos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permisos (
    permiso_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    scopes text,
    activo boolean DEFAULT true NOT NULL,
    categoria_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 403 (class 1259 OID 188132)
-- Name: permisos_permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permisos_permiso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10087 (class 0 OID 0)
-- Dependencies: 403
-- Name: permisos_permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permisos_permiso_id_seq OWNED BY public.permisos.permiso_id;


--
-- TOC entry 404 (class 1259 OID 188133)
-- Name: predio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.predio (
    predio_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    clave_catastral character varying(25),
    cliente_id character varying(13) NOT NULL,
    callejon character varying(150) NOT NULL,
    sector character varying(100) NOT NULL,
    tipo_predio_id integer NOT NULL,
    direccion character varying(255) NOT NULL,
    area_terreno numeric(10,2),
    area_construccion numeric(10,2),
    valor_terreno numeric(18,2),
    valor_construccion numeric(18,2),
    valor_comercial numeric(18,2),
    referencia character varying(255),
    altitud double precision,
    "precision" double precision,
    fecha_geolocalizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    zona_geometrica public.geometry(Polygon,4326),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    coordenadas public.geometry(Point,4326)
);


--
-- TOC entry 405 (class 1259 OID 188150)
-- Name: profesion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profesion (
    profesion_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 406 (class 1259 OID 188159)
-- Name: profesion_profesion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.profesion_profesion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10088 (class 0 OID 0)
-- Dependencies: 406
-- Name: profesion_profesion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.profesion_profesion_id_seq OWNED BY public.profesion.profesion_id;


--
-- TOC entry 407 (class 1259 OID 188160)
-- Name: provincia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provincia (
    provincia_id character varying(8) NOT NULL,
    nombre character varying(100) NOT NULL,
    pais_id character varying(3) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 408 (class 1259 OID 188170)
-- Name: qrcode; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qrcode (
    qrcode_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    imagen_bytea bytea,
    qrcode_url text,
    updated_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 409 (class 1259 OID 188179)
-- Name: qrcode_qrcode_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.qrcode_qrcode_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10089 (class 0 OID 0)
-- Dependencies: 409
-- Name: qrcode_qrcode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.qrcode_qrcode_id_seq OWNED BY public.qrcode.qrcode_id;


--
-- TOC entry 410 (class 1259 OID 188180)
-- Name: rangos_variables; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rangos_variables (
    id integer NOT NULL,
    tarifa_id integer NOT NULL,
    servicio_id integer NOT NULL,
    min_consumo numeric(10,2) NOT NULL,
    max_consumo numeric(10,2),
    tasa_por_m3 numeric(10,4) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_rangos CHECK (((max_consumo IS NULL) OR (max_consumo > min_consumo)))
);


--
-- TOC entry 411 (class 1259 OID 188193)
-- Name: rangos_variables_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rangos_variables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10090 (class 0 OID 0)
-- Dependencies: 411
-- Name: rangos_variables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rangos_variables_id_seq OWNED BY public.rangos_variables.id;


--
-- TOC entry 412 (class 1259 OID 188194)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    id bigint NOT NULL,
    usuario_id uuid NOT NULL,
    token_hash text NOT NULL,
    jti uuid DEFAULT gen_random_uuid(),
    expires_at timestamp with time zone NOT NULL,
    revoked boolean DEFAULT false,
    revoked_at timestamp with time zone,
    device_info text,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now(),
    last_used_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 413 (class 1259 OID 188209)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10091 (class 0 OID 0)
-- Dependencies: 413
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- TOC entry 508 (class 1259 OID 190622)
-- Name: respaldo_acometidas_2026; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.respaldo_acometidas_2026 (
    id integer NOT NULL,
    cedula text,
    apellidos text,
    nombres text,
    sector text,
    num_medidor text,
    direccion text,
    tarifa text,
    novedad text,
    tiene_alcantarillado text,
    tercera_edad integer,
    discapacidad integer,
    cod_factura text,
    lect_act numeric,
    lec_ante numeric,
    consumo_m3 numeric,
    v_agua numeric,
    v_alcantarillado numeric,
    v_comerc numeric,
    v_reconexion numeric,
    total numeric,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 507 (class 1259 OID 190621)
-- Name: respaldo_acometidas_2026_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.respaldo_acometidas_2026_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10092 (class 0 OID 0)
-- Dependencies: 507
-- Name: respaldo_acometidas_2026_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.respaldo_acometidas_2026_id_seq OWNED BY public.respaldo_acometidas_2026.id;


--
-- TOC entry 414 (class 1259 OID 188210)
-- Name: rol_permisos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rol_permisos (
    rol_permiso_id integer NOT NULL,
    rol_id integer NOT NULL,
    permiso_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 415 (class 1259 OID 188220)
-- Name: rol_permisos_rol_permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rol_permisos_rol_permiso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10093 (class 0 OID 0)
-- Dependencies: 415
-- Name: rol_permisos_rol_permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rol_permisos_rol_permiso_id_seq OWNED BY public.rol_permisos.rol_permiso_id;


--
-- TOC entry 416 (class 1259 OID 188221)
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    rol_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    parent_rol_id integer,
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 417 (class 1259 OID 188234)
-- Name: roles_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10094 (class 0 OID 0)
-- Dependencies: 417
-- Name: roles_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_rol_id_seq OWNED BY public.roles.rol_id;


--
-- TOC entry 418 (class 1259 OID 188235)
-- Name: seguimiento_lectura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seguimiento_lectura (
    seguimiento_lectura_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    lectura_id integer NOT NULL,
    usuario_id uuid DEFAULT 'e3400d18-86e1-4eee-9a8b-3e7eaf812a95'::uuid,
    lectura_estado_id integer NOT NULL,
    lectura_estado_anterior_id integer,
    accion character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 419 (class 1259 OID 188248)
-- Name: seguimiento_lectura_seguimiento_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.seguimiento_lectura_seguimiento_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10095 (class 0 OID 0)
-- Dependencies: 419
-- Name: seguimiento_lectura_seguimiento_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.seguimiento_lectura_seguimiento_lectura_id_seq OWNED BY public.seguimiento_lectura.seguimiento_lectura_id;


--
-- TOC entry 420 (class 1259 OID 188249)
-- Name: servicio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servicio (
    servicio_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 421 (class 1259 OID 188260)
-- Name: servicio_servicio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servicio_servicio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10096 (class 0 OID 0)
-- Dependencies: 421
-- Name: servicio_servicio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servicio_servicio_id_seq OWNED BY public.servicio.servicio_id;


--
-- TOC entry 422 (class 1259 OID 188261)
-- Name: sexo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sexo (
    sexo_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 423 (class 1259 OID 188270)
-- Name: sexo_sexo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sexo_sexo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10097 (class 0 OID 0)
-- Dependencies: 423
-- Name: sexo_sexo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sexo_sexo_id_seq OWNED BY public.sexo.sexo_id;


--
-- TOC entry 424 (class 1259 OID 188271)
-- Name: siguiente_lectura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.siguiente_lectura (
    siguiente_lectura_id integer NOT NULL,
    acometida_id character varying(10) NOT NULL,
    ultima_lectura_id integer,
    fecha_siguiente_lectura timestamp without time zone NOT NULL,
    fecha_inicio_periodo timestamp without time zone NOT NULL,
    fecha_fin_periodo timestamp without time zone NOT NULL,
    dias_tolerancia smallint DEFAULT 5 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_siguiente_lectura_fechas CHECK ((fecha_fin_periodo >= fecha_inicio_periodo)),
    CONSTRAINT siguiente_lectura_dias_tolerancia_check CHECK ((dias_tolerancia >= 0))
);


--
-- TOC entry 425 (class 1259 OID 188289)
-- Name: siguiente_lectura_siguiente_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.siguiente_lectura_siguiente_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10098 (class 0 OID 0)
-- Dependencies: 425
-- Name: siguiente_lectura_siguiente_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.siguiente_lectura_siguiente_lectura_id_seq OWNED BY public.siguiente_lectura.siguiente_lectura_id;


--
-- TOC entry 426 (class 1259 OID 188290)
-- Name: tarifa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tarifa (
    tarifa_id integer NOT NULL,
    categoria_id integer NOT NULL,
    effective_date date NOT NULL,
    end_date date,
    descripcion text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_dates CHECK (((end_date IS NULL) OR (end_date > effective_date)))
);


--
-- TOC entry 427 (class 1259 OID 188303)
-- Name: tarifa_tarifa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tarifa_tarifa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10099 (class 0 OID 0)
-- Dependencies: 427
-- Name: tarifa_tarifa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tarifa_tarifa_id_seq OWNED BY public.tarifa.tarifa_id;


--
-- TOC entry 428 (class 1259 OID 188304)
-- Name: telefono_empresa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.telefono_empresa (
    telefono_empresa_id integer NOT NULL,
    telefono_id integer NOT NULL,
    empresa_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 429 (class 1259 OID 188314)
-- Name: telefono_empresa_telefono_empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.telefono_empresa_telefono_empresa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10100 (class 0 OID 0)
-- Dependencies: 429
-- Name: telefono_empresa_telefono_empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.telefono_empresa_telefono_empresa_id_seq OWNED BY public.telefono_empresa.telefono_empresa_id;


--
-- TOC entry 430 (class 1259 OID 188315)
-- Name: telefono_persona_natural; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.telefono_persona_natural (
    telefono_persona_natural_id integer NOT NULL,
    telefono_id integer NOT NULL,
    cliente_persona_natural_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 431 (class 1259 OID 188325)
-- Name: telefono_persona_natural_telefono_persona_natural_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.telefono_persona_natural_telefono_persona_natural_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10101 (class 0 OID 0)
-- Dependencies: 431
-- Name: telefono_persona_natural_telefono_persona_natural_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.telefono_persona_natural_telefono_persona_natural_id_seq OWNED BY public.telefono_persona_natural.telefono_persona_natural_id;


--
-- TOC entry 432 (class 1259 OID 188326)
-- Name: telefono_telefono_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.telefono_telefono_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10102 (class 0 OID 0)
-- Dependencies: 432
-- Name: telefono_telefono_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.telefono_telefono_id_seq OWNED BY public.telefono.telefono_id;


--
-- TOC entry 433 (class 1259 OID 188327)
-- Name: temp_acometida_update; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.temp_acometida_update (
    acometidaid text,
    clavecatastral text,
    clienteid text,
    tarifaid integer,
    numeromedidor text,
    direccion text,
    numeropersonas integer,
    zona text,
    coordenadas text,
    referencia text,
    altitud numeric,
    precision_val numeric,
    fechageolocalizacion timestamp without time zone,
    predioclavecatastral text
);


--
-- TOC entry 434 (class 1259 OID 188332)
-- Name: temp_correo_electronico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.temp_correo_electronico (
    correoid integer,
    email character varying(100),
    clienteid character varying(20)
);


--
-- TOC entry 435 (class 1259 OID 188335)
-- Name: tipo_contrato; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_contrato (
    tipo_contrato_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    duracion_max_meses smallint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 436 (class 1259 OID 188346)
-- Name: tipo_contrato_tipo_contrato_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_contrato_tipo_contrato_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10103 (class 0 OID 0)
-- Dependencies: 436
-- Name: tipo_contrato_tipo_contrato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_contrato_tipo_contrato_id_seq OWNED BY public.tipo_contrato.tipo_contrato_id;


--
-- TOC entry 437 (class 1259 OID 188347)
-- Name: tipo_estado_lectura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_estado_lectura (
    tipo_estado_lectura_id integer NOT NULL,
    codigo character varying(10) NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    permite_facturar boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 438 (class 1259 OID 188359)
-- Name: tipo_estado_lectura_tipo_estado_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_estado_lectura_tipo_estado_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10104 (class 0 OID 0)
-- Dependencies: 438
-- Name: tipo_estado_lectura_tipo_estado_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_estado_lectura_tipo_estado_lectura_id_seq OWNED BY public.tipo_estado_lectura.tipo_estado_lectura_id;


--
-- TOC entry 439 (class 1259 OID 188360)
-- Name: tipo_identificacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_identificacion (
    tipo_identificacion_id character varying(5) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 440 (class 1259 OID 188369)
-- Name: tipo_novedad_lectura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_novedad_lectura (
    tipo_novedad_lectura_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    min_porcentaje numeric(5,2),
    max_porcentaje numeric(5,2),
    accion_recomendada text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 441 (class 1259 OID 188380)
-- Name: tipo_novedad_lectura_tipo_novedad_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_novedad_lectura_tipo_novedad_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10105 (class 0 OID 0)
-- Dependencies: 441
-- Name: tipo_novedad_lectura_tipo_novedad_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_novedad_lectura_tipo_novedad_lectura_id_seq OWNED BY public.tipo_novedad_lectura.tipo_novedad_lectura_id;


--
-- TOC entry 442 (class 1259 OID 188381)
-- Name: tipo_parroquia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_parroquia (
    tipo_parroquia_id character varying(5) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 443 (class 1259 OID 188390)
-- Name: tipo_predio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_predio (
    tipo_predio_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 444 (class 1259 OID 188399)
-- Name: tipo_predio_tipo_predio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_predio_tipo_predio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10106 (class 0 OID 0)
-- Dependencies: 444
-- Name: tipo_predio_tipo_predio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_predio_tipo_predio_id_seq OWNED BY public.tipo_predio.tipo_predio_id;


--
-- TOC entry 445 (class 1259 OID 188400)
-- Name: tipo_relacion_familiar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_relacion_familiar (
    tipo_relacion_familiar_id integer NOT NULL,
    parentesco character varying(50) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 446 (class 1259 OID 188409)
-- Name: tipo_relacion_familiar_tipo_relacion_familiar_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_relacion_familiar_tipo_relacion_familiar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10107 (class 0 OID 0)
-- Dependencies: 446
-- Name: tipo_relacion_familiar_tipo_relacion_familiar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_relacion_familiar_tipo_relacion_familiar_id_seq OWNED BY public.tipo_relacion_familiar.tipo_relacion_familiar_id;


--
-- TOC entry 447 (class 1259 OID 188410)
-- Name: tipo_telefono; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_telefono (
    tipo_telefono_id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 448 (class 1259 OID 188419)
-- Name: tipo_telefono_tipo_telefono_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_telefono_tipo_telefono_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10108 (class 0 OID 0)
-- Dependencies: 448
-- Name: tipo_telefono_tipo_telefono_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_telefono_tipo_telefono_id_seq OWNED BY public.tipo_telefono.tipo_telefono_id;


--
-- TOC entry 449 (class 1259 OID 188420)
-- Name: tipo_titulo_dato; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo_titulo_dato (
    tipo_titulo_dato_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 450 (class 1259 OID 188429)
-- Name: tipo_titulo_dato_tipo_titulo_dato_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_titulo_dato_tipo_titulo_dato_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10109 (class 0 OID 0)
-- Dependencies: 450
-- Name: tipo_titulo_dato_tipo_titulo_dato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_titulo_dato_tipo_titulo_dato_id_seq OWNED BY public.tipo_titulo_dato.tipo_titulo_dato_id;


--
-- TOC entry 451 (class 1259 OID 188430)
-- Name: titulo_dato; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.titulo_dato (
    titulo_dato_id integer NOT NULL,
    tipo_titulo_dato_id integer NOT NULL,
    cliente_id character varying(13) NOT NULL,
    descripcion character varying(255),
    fecha_emision date,
    fecha_vencimiento date,
    monto numeric(15,4) NOT NULL,
    estado character varying(50) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 452 (class 1259 OID 188443)
-- Name: titulo_dato_titulo_dato_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.titulo_dato_titulo_dato_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10110 (class 0 OID 0)
-- Dependencies: 452
-- Name: titulo_dato_titulo_dato_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.titulo_dato_titulo_dato_id_seq OWNED BY public.titulo_dato.titulo_dato_id;


--
-- TOC entry 453 (class 1259 OID 188444)
-- Name: usuario_factura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_factura (
    usuario_factura_id integer NOT NULL,
    usuario_id uuid NOT NULL,
    factura_id integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 454 (class 1259 OID 188456)
-- Name: usuario_factura_usuario_factura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_factura_usuario_factura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10111 (class 0 OID 0)
-- Dependencies: 454
-- Name: usuario_factura_usuario_factura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_factura_usuario_factura_id_seq OWNED BY public.usuario_factura.usuario_factura_id;


--
-- TOC entry 455 (class 1259 OID 188457)
-- Name: usuario_lectura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_lectura (
    usuario_lectura_id integer NOT NULL,
    usuario_id uuid NOT NULL,
    lectura_id integer NOT NULL,
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 456 (class 1259 OID 188471)
-- Name: usuario_lectura_usuario_lectura_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_lectura_usuario_lectura_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10112 (class 0 OID 0)
-- Dependencies: 456
-- Name: usuario_lectura_usuario_lectura_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_lectura_usuario_lectura_id_seq OWNED BY public.usuario_lectura.usuario_lectura_id;


--
-- TOC entry 457 (class 1259 OID 188472)
-- Name: usuario_permisos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_permisos (
    usuario_permiso_id integer NOT NULL,
    usuario_id uuid NOT NULL,
    permiso_id integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_expiracion timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 458 (class 1259 OID 188484)
-- Name: usuario_permisos_usuario_permiso_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_permisos_usuario_permiso_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10113 (class 0 OID 0)
-- Dependencies: 458
-- Name: usuario_permisos_usuario_permiso_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_permisos_usuario_permiso_id_seq OWNED BY public.usuario_permisos.usuario_permiso_id;


--
-- TOC entry 459 (class 1259 OID 188485)
-- Name: usuario_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario_roles (
    usuario_rol_id integer NOT NULL,
    usuario_id uuid NOT NULL,
    rol_id integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 460 (class 1259 OID 188497)
-- Name: usuario_roles_usuario_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_roles_usuario_rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10114 (class 0 OID 0)
-- Dependencies: 460
-- Name: usuario_roles_usuario_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_roles_usuario_rol_id_seq OWNED BY public.usuario_roles.usuario_rol_id;


--
-- TOC entry 461 (class 1259 OID 188498)
-- Name: vw_avance_actualizacion_acometidas; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.vw_avance_actualizacion_acometidas AS
 WITH cte_cliente_contacto AS (
         SELECT c.cliente_id,
            (EXISTS ( SELECT 1
                   FROM public.correo_electronico ce
                  WHERE ((ce.cliente_id)::text = (c.cliente_id)::text))) AS tiene_email,
            (EXISTS ( SELECT 1
                   FROM public.telefono t
                  WHERE (((t.cliente_id)::text = (c.cliente_id)::text) AND (t.es_valido = true)))) AS tiene_telf_valido
           FROM public.cliente c
        ), cte_metricas AS (
         SELECT a.acometida_id,
            a.zona_id,
            a.cliente_id,
            (a.coordenadas IS NOT NULL) AS acometida_actualizada,
            ((p.clave_catastral IS NOT NULL) AND (p.area_terreno > (0)::numeric) AND (p.coordenadas IS NOT NULL)) AS predio_actualizado,
            (cc.tiene_email AND cc.tiene_telf_valido) AS cliente_actualizado,
            GREATEST(a.updated_at, (p.updated_at)::timestamp with time zone, c.updated_at) AS ultima_modificacion_global
           FROM (((public.acometida a
             LEFT JOIN public.predio p ON (((a.predio_clave_catastral)::text = (p.clave_catastral)::text)))
             JOIN public.cliente c ON (((a.cliente_id)::text = (c.cliente_id)::text)))
             JOIN cte_cliente_contacto cc ON (((c.cliente_id)::text = (cc.cliente_id)::text)))
        )
 SELECT acometida_id,
    zona_id,
    cliente_id,
    acometida_actualizada,
    predio_actualizado,
    cliente_actualizado,
    ultima_modificacion_global,
    (acometida_actualizada AND cliente_actualizado) AS actualizacion_completa
   FROM cte_metricas;


--
-- TOC entry 10115 (class 0 OID 0)
-- Dependencies: 461
-- Name: VIEW vw_avance_actualizacion_acometidas; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.vw_avance_actualizacion_acometidas IS 'Vista maestra para el dashboard de actualización. Consolida el estado de Predio, Cliente y Acometida en un único registro por conexión.';


--
-- TOC entry 462 (class 1259 OID 188503)
-- Name: vw_calendario_completo; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.vw_calendario_completo AS
 WITH lecturas_historicas AS (
         SELECT l.acometida_id,
            a.direccion,
            to_char(l.fecha_lectura, 'YYYY-MM'::text) AS mes,
            l.fecha_lectura,
            le.nombre AS estado,
            l.valor_lectura,
            'HISTORICA'::text AS tipo
           FROM ((public.lectura l
             JOIN public.lectura_estado le ON ((le.lectura_estado_id = l.lectura_estado_id)))
             JOIN public.acometida a ON (((a.acometida_id)::text = (l.acometida_id)::text)))
        ), proxima AS (
         SELECT sl.acometida_id,
            a.direccion,
            to_char(sl.fecha_siguiente_lectura, 'YYYY-MM'::text) AS mes,
            sl.fecha_siguiente_lectura AS fecha_lectura,
            'PROXIMA'::text AS estado,
            NULL::numeric AS valor_lectura,
            'PROGRAMADA'::text AS tipo
           FROM (public.siguiente_lectura sl
             JOIN public.acometida a ON (((a.acometida_id)::text = (sl.acometida_id)::text)))
        )
 SELECT lecturas_historicas.acometida_id,
    lecturas_historicas.direccion,
    lecturas_historicas.mes,
    lecturas_historicas.fecha_lectura,
    lecturas_historicas.estado,
    lecturas_historicas.valor_lectura,
    lecturas_historicas.tipo
   FROM lecturas_historicas
UNION ALL
 SELECT proxima.acometida_id,
    proxima.direccion,
    proxima.mes,
    proxima.fecha_lectura,
    proxima.estado,
    proxima.valor_lectura,
    proxima.tipo
   FROM proxima;


--
-- TOC entry 463 (class 1259 OID 188508)
-- Name: vw_calendario_lecturas; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.vw_calendario_lecturas AS
 WITH historial AS (
         SELECT l.acometida_id,
            a.direccion,
            to_char(l.fecha_lectura, 'YYYY-MM'::text) AS mes,
            l.fecha_lectura,
            le.nombre AS estado,
            'REALIZADA'::text AS tipo
           FROM ((public.lectura l
             JOIN public.lectura_estado le ON ((le.lectura_estado_id = l.lectura_estado_id)))
             JOIN public.acometida a ON (((a.acometida_id)::text = (l.acometida_id)::text)))
          WHERE ((le.codigo)::text = ANY (ARRAY[('REAL'::character varying)::text, ('FACT'::character varying)::text]))
        ), proxima AS (
         SELECT sl.acometida_id,
            a.direccion,
            to_char(sl.fecha_siguiente_lectura, 'YYYY-MM'::text) AS mes,
            sl.fecha_siguiente_lectura,
            'PROGRAMADA'::text AS estado,
            'PROXIMA'::text AS tipo
           FROM (public.siguiente_lectura sl
             JOIN public.acometida a ON (((a.acometida_id)::text = (sl.acometida_id)::text)))
        )
 SELECT historial.acometida_id,
    historial.direccion,
    historial.mes,
    historial.fecha_lectura,
    historial.estado,
    historial.tipo
   FROM historial
UNION ALL
 SELECT proxima.acometida_id,
    proxima.direccion,
    proxima.mes,
    proxima.fecha_siguiente_lectura AS fecha_lectura,
    proxima.estado,
    proxima.tipo
   FROM proxima;


--
-- TOC entry 464 (class 1259 OID 188513)
-- Name: vw_historial_lectura; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.vw_historial_lectura AS
 SELECT s.seguimiento_lectura_id,
    s.acometida_id,
    s.lectura_id,
    le.nombre AS estado_actual,
    lea.nombre AS estado_anterior,
    u.username AS usuario,
    s.accion,
    s.descripcion,
    s.created_at
   FROM (((public.seguimiento_lectura s
     JOIN public.lectura_estado le ON ((le.lectura_estado_id = s.lectura_estado_id)))
     LEFT JOIN public.lectura_estado lea ON ((lea.lectura_estado_id = s.lectura_estado_anterior_id)))
     JOIN public.usuarios u ON ((u.usuario_id = s.usuario_id)))
  ORDER BY s.created_at DESC;


--
-- TOC entry 465 (class 1259 OID 188518)
-- Name: zona; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.zona (
    zona_id integer NOT NULL,
    codigo character varying(25) NOT NULL,
    nombre character varying(100),
    descripcion character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 466 (class 1259 OID 188527)
-- Name: zona_zona_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.zona_zona_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10116 (class 0 OID 0)
-- Dependencies: 466
-- Name: zona_zona_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.zona_zona_id_seq OWNED BY public.zona.zona_id;


--
-- TOC entry 467 (class 1259 OID 188528)
-- Name: adjuntos_orden_trabajo; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.adjuntos_orden_trabajo (
    id_adjunto integer NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    nombre_archivo character varying(255) NOT NULL,
    tipo character varying(50) NOT NULL,
    url_archivo character varying(255) NOT NULL,
    fecha_subida timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 468 (class 1259 OID 188539)
-- Name: adjuntos_orden_trabajo_id_adjunto_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.adjuntos_orden_trabajo_id_adjunto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10117 (class 0 OID 0)
-- Dependencies: 468
-- Name: adjuntos_orden_trabajo_id_adjunto_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.adjuntos_orden_trabajo_id_adjunto_seq OWNED BY work_orders.adjuntos_orden_trabajo.id_adjunto;


--
-- TOC entry 469 (class 1259 OID 188540)
-- Name: asignacion_orden_trabajo_trabajador; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.asignacion_orden_trabajo_trabajador (
    id_asignacion integer NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    id_trabajador integer NOT NULL,
    id_rol integer,
    fecha_asignacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 470 (class 1259 OID 188547)
-- Name: asignacion_orden_trabajo_trabajador_id_asignacion_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.asignacion_orden_trabajo_trabajador_id_asignacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10118 (class 0 OID 0)
-- Dependencies: 470
-- Name: asignacion_orden_trabajo_trabajador_id_asignacion_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.asignacion_orden_trabajo_trabajador_id_asignacion_seq OWNED BY work_orders.asignacion_orden_trabajo_trabajador.id_asignacion;


--
-- TOC entry 471 (class 1259 OID 188548)
-- Name: auditoria_inv_inventario; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.auditoria_inv_inventario (
    id_auditoria_inv_inventario integer NOT NULL,
    inv_identificador integer NOT NULL,
    inv_preview_stock numeric(15,2) NOT NULL,
    inv_current_stock numeric(15,2) NOT NULL,
    action_type character varying(10) NOT NULL,
    user_id integer NOT NULL,
    estado smallint DEFAULT 1 NOT NULL,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 472 (class 1259 OID 188561)
-- Name: auditoria_inv_inventario_id_auditoria_inv_inventario_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

ALTER TABLE work_orders.auditoria_inv_inventario ALTER COLUMN id_auditoria_inv_inventario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME work_orders.auditoria_inv_inventario_id_auditoria_inv_inventario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 473 (class 1259 OID 188562)
-- Name: departamento_trabajo; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.departamento_trabajo (
    id_departamento integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255)
);


--
-- TOC entry 10119 (class 0 OID 0)
-- Dependencies: 473
-- Name: TABLE departamento_trabajo; Type: COMMENT; Schema: work_orders; Owner: -
--

COMMENT ON TABLE work_orders.departamento_trabajo IS 'Departments handling work types';


--
-- TOC entry 474 (class 1259 OID 188567)
-- Name: departamento_trabajo_id_departamento_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.departamento_trabajo_id_departamento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10120 (class 0 OID 0)
-- Dependencies: 474
-- Name: departamento_trabajo_id_departamento_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.departamento_trabajo_id_departamento_seq OWNED BY work_orders.departamento_trabajo.id_departamento;


--
-- TOC entry 475 (class 1259 OID 188568)
-- Name: detalle_orden_trabajo_material; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.detalle_orden_trabajo_material (
    id_detalle_orden_trabajo_material integer CONSTRAINT detalle_orden_trabajo_mater_id_detalle_orden_trabajo_m_not_null NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    id_material integer NOT NULL,
    cantidad integer NOT NULL,
    costo_unitario numeric(10,2),
    subtotal numeric(10,2) GENERATED ALWAYS AS ((costo_unitario * (cantidad)::numeric)) STORED,
    CONSTRAINT detalle_orden_trabajo_material_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT detalle_orden_trabajo_material_costo_unitario_check CHECK ((costo_unitario >= (0)::numeric))
);


--
-- TOC entry 476 (class 1259 OID 188578)
-- Name: detalle_orden_trabajo_materia_id_detalle_orden_trabajo_mate_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.detalle_orden_trabajo_materia_id_detalle_orden_trabajo_mate_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10121 (class 0 OID 0)
-- Dependencies: 476
-- Name: detalle_orden_trabajo_materia_id_detalle_orden_trabajo_mate_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.detalle_orden_trabajo_materia_id_detalle_orden_trabajo_mate_seq OWNED BY work_orders.detalle_orden_trabajo_material.id_detalle_orden_trabajo_material;


--
-- TOC entry 477 (class 1259 OID 188579)
-- Name: detalle_prioridad; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.detalle_prioridad (
    id_detalle_prioridad integer NOT NULL,
    id_prioridad integer NOT NULL,
    detalle character varying(255) NOT NULL
);


--
-- TOC entry 478 (class 1259 OID 188585)
-- Name: detalle_prioridad_id_detalle_prioridad_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.detalle_prioridad_id_detalle_prioridad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10122 (class 0 OID 0)
-- Dependencies: 478
-- Name: detalle_prioridad_id_detalle_prioridad_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.detalle_prioridad_id_detalle_prioridad_seq OWNED BY work_orders.detalle_prioridad.id_detalle_prioridad;


--
-- TOC entry 479 (class 1259 OID 188586)
-- Name: detalle_tipo_trabajo; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.detalle_tipo_trabajo (
    id_detalle_tipo_trabajo integer NOT NULL,
    id_tipo_trabajo integer NOT NULL,
    detalle character varying(255) NOT NULL
);


--
-- TOC entry 480 (class 1259 OID 188592)
-- Name: detalle_tipo_trabajo_id_detalle_tipo_trabajo_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.detalle_tipo_trabajo_id_detalle_tipo_trabajo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10123 (class 0 OID 0)
-- Dependencies: 480
-- Name: detalle_tipo_trabajo_id_detalle_tipo_trabajo_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.detalle_tipo_trabajo_id_detalle_tipo_trabajo_seq OWNED BY work_orders.detalle_tipo_trabajo.id_detalle_tipo_trabajo;


--
-- TOC entry 481 (class 1259 OID 188593)
-- Name: estado_orden_trabajo; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.estado_orden_trabajo (
    id_estado integer NOT NULL,
    nombre_estado work_orders.estado_nombre NOT NULL,
    descripcion character varying(255)
);


--
-- TOC entry 482 (class 1259 OID 188598)
-- Name: estado_orden_trabajo_id_estado_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.estado_orden_trabajo_id_estado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10124 (class 0 OID 0)
-- Dependencies: 482
-- Name: estado_orden_trabajo_id_estado_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.estado_orden_trabajo_id_estado_seq OWNED BY work_orders.estado_orden_trabajo.id_estado;


--
-- TOC entry 483 (class 1259 OID 188599)
-- Name: historial_estado_orden_trabajo; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.historial_estado_orden_trabajo (
    id_historial integer NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    id_estado integer NOT NULL,
    fecha_cambio timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario integer,
    descripcion_cambio text,
    clave_catastral character varying(10) NOT NULL,
    codigo_orden text NOT NULL
);


--
-- TOC entry 484 (class 1259 OID 188610)
-- Name: historial_estado_orden_trabajo_id_historial_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.historial_estado_orden_trabajo_id_historial_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10125 (class 0 OID 0)
-- Dependencies: 484
-- Name: historial_estado_orden_trabajo_id_historial_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.historial_estado_orden_trabajo_id_historial_seq OWNED BY work_orders.historial_estado_orden_trabajo.id_historial;


--
-- TOC entry 485 (class 1259 OID 188611)
-- Name: observaciones_orden_trabajo; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.observaciones_orden_trabajo (
    id_observacion integer NOT NULL,
    id_orden_trabajo uuid NOT NULL,
    texto text NOT NULL,
    fecha timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id_trabajador integer
);


--
-- TOC entry 486 (class 1259 OID 188620)
-- Name: observaciones_orden_trabajo_id_observacion_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.observaciones_orden_trabajo_id_observacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10126 (class 0 OID 0)
-- Dependencies: 486
-- Name: observaciones_orden_trabajo_id_observacion_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.observaciones_orden_trabajo_id_observacion_seq OWNED BY work_orders.observaciones_orden_trabajo.id_observacion;


--
-- TOC entry 487 (class 1259 OID 188621)
-- Name: orden_trabajo_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.orden_trabajo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 488 (class 1259 OID 188622)
-- Name: orden_trabajo; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.orden_trabajo (
    id_orden_trabajo uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    numero_secuencial integer DEFAULT nextval('work_orders.orden_trabajo_seq'::regclass) NOT NULL,
    codigo_orden text NOT NULL,
    id_tipo_trabajo integer NOT NULL,
    id_prioridad integer NOT NULL,
    id_cliente character varying(13) NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_asignacion timestamp with time zone,
    fecha_completada timestamp with time zone,
    estado integer NOT NULL,
    descripcion text,
    ubicacion character varying(255),
    usuario_creacion integer,
    usuario_asignacion integer,
    usuario_completacion integer,
    coordenadas public.geometry(Point,4326),
    metadata jsonb,
    clave_catastral character varying(10),
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    CONSTRAINT chk_estado CHECK ((estado IS NOT NULL))
);


--
-- TOC entry 10127 (class 0 OID 0)
-- Dependencies: 488
-- Name: TABLE orden_trabajo; Type: COMMENT; Schema: work_orders; Owner: -
--

COMMENT ON TABLE work_orders.orden_trabajo IS 'Órdenes de trabajo principales – particionada por fecha de creación';


--
-- TOC entry 10128 (class 0 OID 0)
-- Dependencies: 488
-- Name: COLUMN orden_trabajo.numero_secuencial; Type: COMMENT; Schema: work_orders; Owner: -
--

COMMENT ON COLUMN work_orders.orden_trabajo.numero_secuencial IS 'Número secuencial interno usado para generar el código legible';


--
-- TOC entry 10129 (class 0 OID 0)
-- Dependencies: 488
-- Name: COLUMN orden_trabajo.codigo_orden; Type: COMMENT; Schema: work_orders; Owner: -
--

COMMENT ON COLUMN work_orders.orden_trabajo.codigo_orden IS 'Código legible para usuarios e impresión: OT-2025-0000001, OT-2025-0000002, etc.';


--
-- TOC entry 489 (class 1259 OID 188640)
-- Name: prioridad_orden_trabajo; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.prioridad_orden_trabajo (
    id_prioridad integer NOT NULL,
    nivel work_orders.prioridad_nivel NOT NULL,
    descripcion character varying(255) NOT NULL
);


--
-- TOC entry 490 (class 1259 OID 188646)
-- Name: prioridad_orden_trabajo_id_prioridad_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.prioridad_orden_trabajo_id_prioridad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10130 (class 0 OID 0)
-- Dependencies: 490
-- Name: prioridad_orden_trabajo_id_prioridad_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.prioridad_orden_trabajo_id_prioridad_seq OWNED BY work_orders.prioridad_orden_trabajo.id_prioridad;


--
-- TOC entry 491 (class 1259 OID 188647)
-- Name: rol_trabajador; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.rol_trabajador (
    id_rol integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255)
);


--
-- TOC entry 492 (class 1259 OID 188652)
-- Name: rol_trabajador_id_rol_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.rol_trabajador_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10131 (class 0 OID 0)
-- Dependencies: 492
-- Name: rol_trabajador_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.rol_trabajador_id_rol_seq OWNED BY work_orders.rol_trabajador.id_rol;


--
-- TOC entry 493 (class 1259 OID 188653)
-- Name: tipo_trabajo; Type: TABLE; Schema: work_orders; Owner: -
--

CREATE TABLE work_orders.tipo_trabajo (
    id_tipo_trabajo integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion character varying(255) NOT NULL,
    id_departamento integer NOT NULL
);


--
-- TOC entry 10132 (class 0 OID 0)
-- Dependencies: 493
-- Name: TABLE tipo_trabajo; Type: COMMENT; Schema: work_orders; Owner: -
--

COMMENT ON TABLE work_orders.tipo_trabajo IS 'Types of work, linked to departments';


--
-- TOC entry 494 (class 1259 OID 188660)
-- Name: tipo_trabajo_id_tipo_trabajo_seq; Type: SEQUENCE; Schema: work_orders; Owner: -
--

CREATE SEQUENCE work_orders.tipo_trabajo_id_tipo_trabajo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 10133 (class 0 OID 0)
-- Dependencies: 494
-- Name: tipo_trabajo_id_tipo_trabajo_seq; Type: SEQUENCE OWNED BY; Schema: work_orders; Owner: -
--

ALTER SEQUENCE work_orders.tipo_trabajo_id_tipo_trabajo_seq OWNED BY work_orders.tipo_trabajo.id_tipo_trabajo;


--
-- TOC entry 495 (class 1259 OID 188661)
-- Name: view_active_work_orders; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_active_work_orders AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    ot.clave_catastral AS cadastral_key,
    ot.descripcion AS work_order_description,
    ot.ubicacion AS work_order_location,
    public.st_astext(ot.coordenadas) AS coordinates_wkt,
    public.st_x(ot.coordenadas) AS longitude,
    public.st_y(ot.coordenadas) AS latitude,
    tt.nombre AS work_type,
    dep.nombre AS department,
    prio.nivel AS priority,
    est_actual.nombre_estado AS current_state,
    ot.id_cliente AS client_id,
    ot.usuario_creacion AS created_by_user_id,
    ot.usuario_asignacion AS assigned_to_user_id,
    ot.usuario_completacion AS completed_by_user_id,
    ot.fecha_creacion AS creation_date,
    ot.fecha_asignacion AS assignment_date,
    ot.fecha_completada AS completion_date
   FROM ((((work_orders.orden_trabajo ot
     LEFT JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     LEFT JOIN work_orders.departamento_trabajo dep ON ((tt.id_departamento = dep.id_departamento)))
     LEFT JOIN work_orders.prioridad_orden_trabajo prio ON ((ot.id_prioridad = prio.id_prioridad)))
     LEFT JOIN work_orders.estado_orden_trabajo est_actual ON ((ot.estado = est_actual.id_estado)))
  WHERE ((ot.is_deleted = false) AND (est_actual.nombre_estado <> ALL (ARRAY['Completada'::work_orders.estado_nombre, 'Cancelada'::work_orders.estado_nombre])))
  ORDER BY ot.codigo_orden;


--
-- TOC entry 496 (class 1259 OID 188666)
-- Name: view_all_work_orders_full_details; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_all_work_orders_full_details AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    ot.clave_catastral AS cadastral_key,
    ot.descripcion AS work_order_description,
    ot.ubicacion AS work_order_location,
    public.st_astext(ot.coordenadas) AS coordinates_wkt,
    public.st_x(ot.coordenadas) AS longitude,
    public.st_y(ot.coordenadas) AS latitude,
    tt.nombre AS work_type,
    dep.nombre AS department,
    prio.nivel AS priority,
    est_actual.nombre_estado AS current_state,
    ot.id_cliente AS client_id,
    ot.usuario_creacion AS created_by_user_id,
    ot.usuario_asignacion AS assigned_to_user_id,
    ot.usuario_completacion AS completed_by_user_id,
    ot.fecha_creacion AS creation_date,
    ot.fecha_asignacion AS assignment_date,
    ot.fecha_completada AS completion_date,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object('file_name', aot.nombre_archivo, 'file_type', aot.tipo, 'file_url', aot.url_archivo, 'upload_date', aot.fecha_subida)) FILTER (WHERE (aot.id_adjunto IS NOT NULL)), '[]'::jsonb) AS management_attachments,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object('material_id', dotm.id_material, 'quantity', dotm.cantidad, 'unit_cost', dotm.costo_unitario, 'subtotal_cost', dotm.subtotal)) FILTER (WHERE (dotm.id_detalle_orden_trabajo_material IS NOT NULL)), '[]'::jsonb) AS materials_used,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object('observation_text', oot.texto, 'observation_date', oot.fecha, 'observer_worker_id', oot.id_trabajador)) FILTER (WHERE (oot.id_observacion IS NOT NULL)), '[]'::jsonb) AS observations_made,
    COALESCE(jsonb_agg(DISTINCT jsonb_build_object('worker_id', atot.id_trabajador, 'worker_role', rt.nombre, 'assignment_date', atot.fecha_asignacion)) FILTER (WHERE (atot.id_asignacion IS NOT NULL)), '[]'::jsonb) AS assigned_workers
   FROM (((((((((work_orders.orden_trabajo ot
     LEFT JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     LEFT JOIN work_orders.departamento_trabajo dep ON ((tt.id_departamento = dep.id_departamento)))
     LEFT JOIN work_orders.prioridad_orden_trabajo prio ON ((ot.id_prioridad = prio.id_prioridad)))
     LEFT JOIN work_orders.estado_orden_trabajo est_actual ON ((ot.estado = est_actual.id_estado)))
     LEFT JOIN work_orders.adjuntos_orden_trabajo aot ON ((ot.id_orden_trabajo = aot.id_orden_trabajo)))
     LEFT JOIN work_orders.detalle_orden_trabajo_material dotm ON ((ot.id_orden_trabajo = dotm.id_orden_trabajo)))
     LEFT JOIN work_orders.observaciones_orden_trabajo oot ON ((ot.id_orden_trabajo = oot.id_orden_trabajo)))
     LEFT JOIN work_orders.asignacion_orden_trabajo_trabajador atot ON ((ot.id_orden_trabajo = atot.id_orden_trabajo)))
     LEFT JOIN work_orders.rol_trabajador rt ON ((atot.id_rol = rt.id_rol)))
  WHERE (ot.is_deleted = false)
  GROUP BY ot.id_orden_trabajo, ot.codigo_orden, ot.clave_catastral, ot.descripcion, ot.ubicacion, ot.coordenadas, tt.nombre, dep.nombre, prio.nivel, est_actual.nombre_estado, ot.id_cliente, ot.usuario_creacion, ot.usuario_asignacion, ot.usuario_completacion, ot.fecha_creacion, ot.fecha_asignacion, ot.fecha_completada
  ORDER BY ot.codigo_orden;


--
-- TOC entry 497 (class 1259 OID 188671)
-- Name: view_dashboard_ordenes_trabajo; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_dashboard_ordenes_trabajo AS
 SELECT ot.id_orden_trabajo,
    ot.numero_secuencial,
    ot.codigo_orden,
    ot.fecha_creacion,
    ot.fecha_asignacion,
    ot.fecha_completada,
    (EXTRACT(epoch FROM (ot.fecha_completada - ot.fecha_creacion)) / (3600)::numeric) AS horas_totales_completar,
    (EXTRACT(epoch FROM (ot.fecha_asignacion - ot.fecha_creacion)) / (3600)::numeric) AS horas_hasta_asignacion,
    (EXTRACT(epoch FROM (ot.fecha_completada - ot.fecha_asignacion)) / (3600)::numeric) AS horas_ejecucion,
    ot.id_cliente,
    ot.ubicacion,
    ot.clave_catastral,
    ot.coordenadas,
    public.st_x(ot.coordenadas) AS longitud,
    public.st_y(ot.coordenadas) AS latitud,
    tt.nombre AS tipo_trabajo,
    tt.descripcion AS desc_tipo_trabajo,
    dt.nombre AS departamento,
    dt.descripcion AS desc_departamento,
    pot.nivel AS prioridad_nivel,
    pot.descripcion AS desc_prioridad,
    eot.nombre_estado AS estado,
    eot.descripcion AS desc_estado,
    ot.descripcion,
    ot.metadata,
    ot.usuario_creacion,
    ot.usuario_asignacion,
    ot.usuario_completacion,
    ot.is_deleted,
        CASE
            WHEN (ot.estado IN ( SELECT estado_orden_trabajo.id_estado
               FROM work_orders.estado_orden_trabajo
              WHERE (estado_orden_trabajo.nombre_estado = ANY (ARRAY['Completada'::work_orders.estado_nombre, 'Cancelada'::work_orders.estado_nombre])))) THEN true
            ELSE false
        END AS cerrada,
        CASE
            WHEN (pot.nivel = ANY (ARRAY['Emergencia'::work_orders.prioridad_nivel, 'Urgente'::work_orders.prioridad_nivel])) THEN true
            ELSE false
        END AS es_critica,
    COALESCE(mat.cantidad_materiales, (0)::bigint) AS cantidad_materiales,
    COALESCE(mat.costo_total_materiales, (0)::numeric(12,2)) AS costo_total_materiales,
    COALESCE(trab.cantidad_trabajadores, (0)::bigint) AS cantidad_trabajadores_asignados,
    COALESCE(adj.cantidad_adjuntos, (0)::bigint) AS cantidad_adjuntos,
    COALESCE(obs.cantidad_observaciones, (0)::bigint) AS cantidad_observaciones
   FROM ((((((((work_orders.orden_trabajo ot
     LEFT JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     LEFT JOIN work_orders.departamento_trabajo dt ON ((tt.id_departamento = dt.id_departamento)))
     LEFT JOIN work_orders.prioridad_orden_trabajo pot ON ((ot.id_prioridad = pot.id_prioridad)))
     LEFT JOIN work_orders.estado_orden_trabajo eot ON ((ot.estado = eot.id_estado)))
     LEFT JOIN ( SELECT detalle_orden_trabajo_material.id_orden_trabajo,
            count(*) AS cantidad_materiales,
            sum(detalle_orden_trabajo_material.subtotal) AS costo_total_materiales
           FROM work_orders.detalle_orden_trabajo_material
          GROUP BY detalle_orden_trabajo_material.id_orden_trabajo) mat ON ((ot.id_orden_trabajo = mat.id_orden_trabajo)))
     LEFT JOIN ( SELECT asignacion_orden_trabajo_trabajador.id_orden_trabajo,
            count(*) AS cantidad_trabajadores
           FROM work_orders.asignacion_orden_trabajo_trabajador
          GROUP BY asignacion_orden_trabajo_trabajador.id_orden_trabajo) trab ON ((ot.id_orden_trabajo = trab.id_orden_trabajo)))
     LEFT JOIN ( SELECT adjuntos_orden_trabajo.id_orden_trabajo,
            count(*) AS cantidad_adjuntos
           FROM work_orders.adjuntos_orden_trabajo
          GROUP BY adjuntos_orden_trabajo.id_orden_trabajo) adj ON ((ot.id_orden_trabajo = adj.id_orden_trabajo)))
     LEFT JOIN ( SELECT observaciones_orden_trabajo.id_orden_trabajo,
            count(*) AS cantidad_observaciones
           FROM work_orders.observaciones_orden_trabajo
          GROUP BY observaciones_orden_trabajo.id_orden_trabajo) obs ON ((ot.id_orden_trabajo = obs.id_orden_trabajo)))
  WHERE (ot.is_deleted = false);


--
-- TOC entry 10134 (class 0 OID 0)
-- Dependencies: 497
-- Name: VIEW view_dashboard_ordenes_trabajo; Type: COMMENT; Schema: work_orders; Owner: -
--

COMMENT ON VIEW work_orders.view_dashboard_ordenes_trabajo IS 'Vista desnormalizada completa para dashboards. Incluye todos los campos necesarios para filtrar, agrupar y visualizar KPIs de órdenes de trabajo. Única fuente de verdad para reporting.';


--
-- TOC entry 498 (class 1259 OID 188676)
-- Name: view_historical_work_orders; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_historical_work_orders AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    ot.clave_catastral AS cadastral_key,
    ot.descripcion AS work_order_description,
    ot.ubicacion AS work_order_location,
    public.st_astext(ot.coordenadas) AS coordinates_wkt,
    public.st_x(ot.coordenadas) AS longitude,
    public.st_y(ot.coordenadas) AS latitude,
    tt.nombre AS work_type,
    dep.nombre AS department,
    prio.nivel AS priority,
    est_actual.nombre_estado AS current_state,
    ot.id_cliente AS client_id,
    ot.usuario_creacion AS created_by_user_id,
    ot.usuario_asignacion AS assigned_to_user_id,
    ot.usuario_completacion AS completed_by_user_id,
    ot.fecha_creacion AS creation_date,
    ot.fecha_asignacion AS assignment_date,
    ot.fecha_completada AS completion_date,
    he.id_historial AS historical_id,
    he.id_estado AS historical_state_id,
    est_hist.nombre_estado AS historical_state_name,
    he.fecha_cambio AS state_change_date,
    he.id_usuario AS state_change_user_id,
    he.descripcion_cambio AS change_description,
    row_number() OVER (PARTITION BY ot.id_orden_trabajo ORDER BY he.fecha_cambio) AS change_number
   FROM ((((((work_orders.orden_trabajo ot
     LEFT JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     LEFT JOIN work_orders.departamento_trabajo dep ON ((tt.id_departamento = dep.id_departamento)))
     LEFT JOIN work_orders.prioridad_orden_trabajo prio ON ((ot.id_prioridad = prio.id_prioridad)))
     LEFT JOIN work_orders.estado_orden_trabajo est_actual ON ((ot.estado = est_actual.id_estado)))
     LEFT JOIN work_orders.historial_estado_orden_trabajo he ON ((ot.id_orden_trabajo = he.id_orden_trabajo)))
     LEFT JOIN work_orders.estado_orden_trabajo est_hist ON ((he.id_estado = est_hist.id_estado)))
  WHERE (ot.is_deleted = false)
  ORDER BY ot.codigo_orden, he.fecha_cambio;


--
-- TOC entry 499 (class 1259 OID 188681)
-- Name: view_orden_trabajo_detalle; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_orden_trabajo_detalle AS
 SELECT ot.id_orden_trabajo,
    tt.nombre AS tipo_trabajo,
    pot.nivel AS prioridad,
    eot.nombre_estado AS estado,
    ot.descripcion,
    ot.coordenadas
   FROM (((work_orders.orden_trabajo ot
     JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     JOIN work_orders.prioridad_orden_trabajo pot ON ((ot.id_prioridad = pot.id_prioridad)))
     JOIN work_orders.estado_orden_trabajo eot ON ((ot.estado = eot.id_estado)))
  WHERE (ot.deleted_at IS NULL);


--
-- TOC entry 500 (class 1259 OID 188686)
-- Name: view_work_order_assignments; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_work_order_assignments AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    atot.id_trabajador AS worker_id,
    rt.nombre AS worker_role,
    atot.fecha_asignacion AS assignment_date
   FROM ((work_orders.orden_trabajo ot
     JOIN work_orders.asignacion_orden_trabajo_trabajador atot ON ((ot.id_orden_trabajo = atot.id_orden_trabajo)))
     JOIN work_orders.rol_trabajador rt ON ((atot.id_rol = rt.id_rol)))
  WHERE (ot.is_deleted = false)
  ORDER BY ot.codigo_orden, atot.fecha_asignacion;


--
-- TOC entry 501 (class 1259 OID 188691)
-- Name: view_work_order_attachments; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_work_order_attachments AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    aot.nombre_archivo AS file_name,
    aot.tipo AS file_type,
    aot.url_archivo AS file_url,
    aot.fecha_subida AS upload_date
   FROM (work_orders.orden_trabajo ot
     JOIN work_orders.adjuntos_orden_trabajo aot ON ((ot.id_orden_trabajo = aot.id_orden_trabajo)))
  WHERE (ot.is_deleted = false)
  ORDER BY ot.codigo_orden, aot.fecha_subida;


--
-- TOC entry 502 (class 1259 OID 188696)
-- Name: view_work_order_key_statistics; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_work_order_key_statistics AS
 SELECT count(*) AS total_orders,
    eot.id_estado AS status_id,
    eot.nombre_estado AS status_name,
    ot.id_tipo_trabajo AS work_type_id,
    tt.nombre AS work_type,
    dt.id_departamento AS department_id,
    dt.nombre AS department_name,
    count(*) FILTER (WHERE (pot.nivel = 'Emergencia'::work_orders.prioridad_nivel)) AS emergency,
    count(*) FILTER (WHERE (pot.nivel = 'Urgente'::work_orders.prioridad_nivel)) AS urgent,
    count(*) FILTER (WHERE (pot.nivel = 'Alta'::work_orders.prioridad_nivel)) AS high,
    count(*) FILTER (WHERE (pot.nivel = 'Media'::work_orders.prioridad_nivel)) AS medium,
    count(*) FILTER (WHERE (pot.nivel = 'Baja'::work_orders.prioridad_nivel)) AS low,
    count(*) FILTER (WHERE (pot.nivel = ANY (ARRAY['Emergencia'::work_orders.prioridad_nivel, 'Urgente'::work_orders.prioridad_nivel]))) AS critical_orders,
    count(*) FILTER (WHERE (ot.fecha_creacion >= CURRENT_DATE)) AS created_today,
    count(*) FILTER (WHERE (ot.fecha_creacion >= (CURRENT_DATE - '7 days'::interval))) AS created_last_7_days,
    count(*) FILTER (WHERE (ot.fecha_creacion >= date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone))) AS created_this_month,
    count(*) FILTER (WHERE (eot.nombre_estado = ANY (ARRAY['Completada'::work_orders.estado_nombre, 'Cancelada'::work_orders.estado_nombre]))) AS closed,
    count(*) FILTER (WHERE (eot.nombre_estado = 'Completada'::work_orders.estado_nombre)) AS completed,
    avg((EXTRACT(epoch FROM (ot.fecha_completada - ot.fecha_creacion)) / (3600)::numeric)) FILTER (WHERE (ot.fecha_completada IS NOT NULL)) AS avg_hours_to_complete,
    avg((EXTRACT(epoch FROM (ot.fecha_asignacion - ot.fecha_creacion)) / (3600)::numeric)) FILTER (WHERE (ot.fecha_asignacion IS NOT NULL)) AS avg_hours_to_assignment,
    avg((EXTRACT(epoch FROM (ot.fecha_completada - ot.fecha_asignacion)) / (3600)::numeric)) FILTER (WHERE ((ot.fecha_completada IS NOT NULL) AND (ot.fecha_asignacion IS NOT NULL))) AS avg_hours_to_execution,
    round(((100.0 * (count(*) FILTER (WHERE (eot.nombre_estado = 'Completada'::work_orders.estado_nombre)))::numeric) / (NULLIF(count(*), 0))::numeric), 2) AS pct_completed_in_group,
    round(((100.0 * (count(*) FILTER (WHERE (eot.nombre_estado = ANY (ARRAY['Pendiente'::work_orders.estado_nombre, 'Asignada'::work_orders.estado_nombre]))))::numeric) / (NULLIF(count(*), 0))::numeric), 2) AS pct_pending_or_assigned,
    (COALESCE(sum(mat.costo_total), (0)::numeric))::numeric(12,2) AS total_material_cost,
    (avg(trab.cantidad_trabajadores))::numeric(5,1) AS avg_workers_per_order,
    sum(trab.cantidad_trabajadores) AS total_worker_assignments
   FROM ((((((work_orders.orden_trabajo ot
     JOIN work_orders.estado_orden_trabajo eot ON ((eot.id_estado = ot.estado)))
     JOIN work_orders.tipo_trabajo tt ON ((tt.id_tipo_trabajo = ot.id_tipo_trabajo)))
     JOIN work_orders.departamento_trabajo dt ON ((dt.id_departamento = tt.id_departamento)))
     JOIN work_orders.prioridad_orden_trabajo pot ON ((pot.id_prioridad = ot.id_prioridad)))
     LEFT JOIN ( SELECT detalle_orden_trabajo_material.id_orden_trabajo,
            sum(detalle_orden_trabajo_material.subtotal) AS costo_total
           FROM work_orders.detalle_orden_trabajo_material
          GROUP BY detalle_orden_trabajo_material.id_orden_trabajo) mat ON ((ot.id_orden_trabajo = mat.id_orden_trabajo)))
     LEFT JOIN ( SELECT asignacion_orden_trabajo_trabajador.id_orden_trabajo,
            count(*) AS cantidad_trabajadores
           FROM work_orders.asignacion_orden_trabajo_trabajador
          GROUP BY asignacion_orden_trabajo_trabajador.id_orden_trabajo) trab ON ((ot.id_orden_trabajo = trab.id_orden_trabajo)))
  WHERE (ot.is_deleted = false)
  GROUP BY eot.id_estado, eot.nombre_estado, ot.id_tipo_trabajo, tt.nombre, dt.id_departamento, dt.nombre
  ORDER BY dt.nombre, tt.nombre, (count(*)) DESC;


--
-- TOC entry 503 (class 1259 OID 188701)
-- Name: view_work_order_materials; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_work_order_materials AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    dotm.id_material AS material_id,
    dotm.cantidad AS quantity,
    dotm.costo_unitario AS unit_cost,
    dotm.subtotal AS subtotal_cost
   FROM (work_orders.orden_trabajo ot
     JOIN work_orders.detalle_orden_trabajo_material dotm ON ((ot.id_orden_trabajo = dotm.id_orden_trabajo)))
  WHERE (ot.is_deleted = false)
  ORDER BY ot.codigo_orden, dotm.id_material;


--
-- TOC entry 504 (class 1259 OID 188706)
-- Name: view_work_order_observations; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_work_order_observations AS
 SELECT ot.id_orden_trabajo AS work_order_id,
    ot.codigo_orden AS work_order_code,
    oot.texto AS observation_text,
    oot.fecha AS observation_date,
    oot.id_trabajador AS observer_worker_id
   FROM (work_orders.orden_trabajo ot
     JOIN work_orders.observaciones_orden_trabajo oot ON ((ot.id_orden_trabajo = oot.id_orden_trabajo)))
  WHERE (ot.is_deleted = false)
  ORDER BY ot.codigo_orden, oot.fecha;


--
-- TOC entry 505 (class 1259 OID 188711)
-- Name: view_work_order_statistics; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_work_order_statistics AS
 SELECT tt.nombre AS work_type,
    prio.nivel AS priority,
    count(ot.id_orden_trabajo) AS total_orders,
    sum(
        CASE
            WHEN (est.nombre_estado = 'Completada'::work_orders.estado_nombre) THEN 1
            ELSE 0
        END) AS completed_orders,
    sum(
        CASE
            WHEN (est.nombre_estado = 'Cancelada'::work_orders.estado_nombre) THEN 1
            ELSE 0
        END) AS cancelled_orders,
    avg((EXTRACT(epoch FROM (ot.fecha_completada - ot.fecha_creacion)) / (3600)::numeric)) AS avg_completion_time_hours
   FROM (((work_orders.orden_trabajo ot
     LEFT JOIN work_orders.tipo_trabajo tt ON ((ot.id_tipo_trabajo = tt.id_tipo_trabajo)))
     LEFT JOIN work_orders.prioridad_orden_trabajo prio ON ((ot.id_prioridad = prio.id_prioridad)))
     LEFT JOIN work_orders.estado_orden_trabajo est ON ((ot.estado = est.id_estado)))
  WHERE (ot.is_deleted = false)
  GROUP BY tt.nombre, prio.nivel
  ORDER BY tt.nombre, prio.nivel;


--
-- TOC entry 506 (class 1259 OID 188716)
-- Name: view_work_orders_by_client; Type: VIEW; Schema: work_orders; Owner: -
--

CREATE VIEW work_orders.view_work_orders_by_client AS
 SELECT ot.id_cliente AS client_id,
    count(ot.id_orden_trabajo) AS total_orders,
    sum(
        CASE
            WHEN (est.nombre_estado = 'Completada'::work_orders.estado_nombre) THEN 1
            ELSE 0
        END) AS completed_orders,
    sum(
        CASE
            WHEN (est.nombre_estado = 'Cancelada'::work_orders.estado_nombre) THEN 1
            ELSE 0
        END) AS cancelled_orders
   FROM (work_orders.orden_trabajo ot
     LEFT JOIN work_orders.estado_orden_trabajo est ON ((ot.estado = est.id_estado)))
  WHERE (ot.is_deleted = false)
  GROUP BY ot.id_cliente
  ORDER BY ot.id_cliente;


--
-- TOC entry 7390 (class 0 OID 0)
-- Name: registro_2024_01; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_01 FOR VALUES FROM ('2024-01-01 00:00:00-05') TO ('2024-02-01 00:00:00-05');


--
-- TOC entry 7391 (class 0 OID 0)
-- Name: registro_2024_02; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_02 FOR VALUES FROM ('2024-02-01 00:00:00-05') TO ('2024-03-01 00:00:00-05');


--
-- TOC entry 7392 (class 0 OID 0)
-- Name: registro_2024_03; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_03 FOR VALUES FROM ('2024-03-01 00:00:00-05') TO ('2024-04-01 00:00:00-05');


--
-- TOC entry 7393 (class 0 OID 0)
-- Name: registro_2024_04; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_04 FOR VALUES FROM ('2024-04-01 00:00:00-05') TO ('2024-05-01 00:00:00-05');


--
-- TOC entry 7394 (class 0 OID 0)
-- Name: registro_2024_05; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_05 FOR VALUES FROM ('2024-05-01 00:00:00-05') TO ('2024-06-01 00:00:00-05');


--
-- TOC entry 7395 (class 0 OID 0)
-- Name: registro_2024_06; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_06 FOR VALUES FROM ('2024-06-01 00:00:00-05') TO ('2024-07-01 00:00:00-05');


--
-- TOC entry 7396 (class 0 OID 0)
-- Name: registro_2024_07; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_07 FOR VALUES FROM ('2024-07-01 00:00:00-05') TO ('2024-08-01 00:00:00-05');


--
-- TOC entry 7397 (class 0 OID 0)
-- Name: registro_2024_08; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_08 FOR VALUES FROM ('2024-08-01 00:00:00-05') TO ('2024-09-01 00:00:00-05');


--
-- TOC entry 7398 (class 0 OID 0)
-- Name: registro_2024_09; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_09 FOR VALUES FROM ('2024-09-01 00:00:00-05') TO ('2024-10-01 00:00:00-05');


--
-- TOC entry 7399 (class 0 OID 0)
-- Name: registro_2024_10; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_10 FOR VALUES FROM ('2024-10-01 00:00:00-05') TO ('2024-11-01 00:00:00-05');


--
-- TOC entry 7400 (class 0 OID 0)
-- Name: registro_2024_11; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_11 FOR VALUES FROM ('2024-11-01 00:00:00-05') TO ('2024-12-01 00:00:00-05');


--
-- TOC entry 7401 (class 0 OID 0)
-- Name: registro_2024_12; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2024_12 FOR VALUES FROM ('2024-12-01 00:00:00-05') TO ('2025-01-01 00:00:00-05');


--
-- TOC entry 7402 (class 0 OID 0)
-- Name: registro_2025_01; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_01 FOR VALUES FROM ('2025-01-01 00:00:00-05') TO ('2025-02-01 00:00:00-05');


--
-- TOC entry 7403 (class 0 OID 0)
-- Name: registro_2025_02; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_02 FOR VALUES FROM ('2025-02-01 00:00:00-05') TO ('2025-03-01 00:00:00-05');


--
-- TOC entry 7404 (class 0 OID 0)
-- Name: registro_2025_03; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_03 FOR VALUES FROM ('2025-03-01 00:00:00-05') TO ('2025-04-01 00:00:00-05');


--
-- TOC entry 7405 (class 0 OID 0)
-- Name: registro_2025_04; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_04 FOR VALUES FROM ('2025-04-01 00:00:00-05') TO ('2025-05-01 00:00:00-05');


--
-- TOC entry 7406 (class 0 OID 0)
-- Name: registro_2025_05; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_05 FOR VALUES FROM ('2025-05-01 00:00:00-05') TO ('2025-06-01 00:00:00-05');


--
-- TOC entry 7407 (class 0 OID 0)
-- Name: registro_2025_06; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_06 FOR VALUES FROM ('2025-06-01 00:00:00-05') TO ('2025-07-01 00:00:00-05');


--
-- TOC entry 7408 (class 0 OID 0)
-- Name: registro_2025_07; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_07 FOR VALUES FROM ('2025-07-01 00:00:00-05') TO ('2025-08-01 00:00:00-05');


--
-- TOC entry 7409 (class 0 OID 0)
-- Name: registro_2025_08; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_08 FOR VALUES FROM ('2025-08-01 00:00:00-05') TO ('2025-09-01 00:00:00-05');


--
-- TOC entry 7410 (class 0 OID 0)
-- Name: registro_2025_09; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_09 FOR VALUES FROM ('2025-09-01 00:00:00-05') TO ('2025-10-01 00:00:00-05');


--
-- TOC entry 7411 (class 0 OID 0)
-- Name: registro_2025_10; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_10 FOR VALUES FROM ('2025-10-01 00:00:00-05') TO ('2025-11-01 00:00:00-05');


--
-- TOC entry 7412 (class 0 OID 0)
-- Name: registro_2025_11; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_11 FOR VALUES FROM ('2025-11-01 00:00:00-05') TO ('2025-12-01 00:00:00-05');


--
-- TOC entry 7413 (class 0 OID 0)
-- Name: registro_2025_12; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2025_12 FOR VALUES FROM ('2025-12-01 00:00:00-05') TO ('2026-01-01 00:00:00-05');


--
-- TOC entry 7414 (class 0 OID 0)
-- Name: registro_2026_01; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_01 FOR VALUES FROM ('2026-01-01 00:00:00-05') TO ('2026-02-01 00:00:00-05');


--
-- TOC entry 7415 (class 0 OID 0)
-- Name: registro_2026_02; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_02 FOR VALUES FROM ('2026-02-01 00:00:00-05') TO ('2026-03-01 00:00:00-05');


--
-- TOC entry 7416 (class 0 OID 0)
-- Name: registro_2026_03; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_03 FOR VALUES FROM ('2026-03-01 00:00:00-05') TO ('2026-04-01 00:00:00-05');


--
-- TOC entry 7417 (class 0 OID 0)
-- Name: registro_2026_04; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_04 FOR VALUES FROM ('2026-04-01 00:00:00-05') TO ('2026-05-01 00:00:00-05');


--
-- TOC entry 7418 (class 0 OID 0)
-- Name: registro_2026_05; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_05 FOR VALUES FROM ('2026-05-01 00:00:00-05') TO ('2026-06-01 00:00:00-05');


--
-- TOC entry 7419 (class 0 OID 0)
-- Name: registro_2026_06; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_06 FOR VALUES FROM ('2026-06-01 00:00:00-05') TO ('2026-07-01 00:00:00-05');


--
-- TOC entry 7420 (class 0 OID 0)
-- Name: registro_2026_07; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_07 FOR VALUES FROM ('2026-07-01 00:00:00-05') TO ('2026-08-01 00:00:00-05');


--
-- TOC entry 7421 (class 0 OID 0)
-- Name: registro_2026_08; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_08 FOR VALUES FROM ('2026-08-01 00:00:00-05') TO ('2026-09-01 00:00:00-05');


--
-- TOC entry 7422 (class 0 OID 0)
-- Name: registro_2026_09; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_09 FOR VALUES FROM ('2026-09-01 00:00:00-05') TO ('2026-10-01 00:00:00-05');


--
-- TOC entry 7423 (class 0 OID 0)
-- Name: registro_2026_10; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_10 FOR VALUES FROM ('2026-10-01 00:00:00-05') TO ('2026-11-01 00:00:00-05');


--
-- TOC entry 7424 (class 0 OID 0)
-- Name: registro_2026_11; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_11 FOR VALUES FROM ('2026-11-01 00:00:00-05') TO ('2026-12-01 00:00:00-05');


--
-- TOC entry 7425 (class 0 OID 0)
-- Name: registro_2026_12; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2026_12 FOR VALUES FROM ('2026-12-01 00:00:00-05') TO ('2027-01-01 00:00:00-05');


--
-- TOC entry 7426 (class 0 OID 0)
-- Name: registro_2027_01; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_01 FOR VALUES FROM ('2027-01-01 00:00:00-05') TO ('2027-02-01 00:00:00-05');


--
-- TOC entry 7427 (class 0 OID 0)
-- Name: registro_2027_02; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_02 FOR VALUES FROM ('2027-02-01 00:00:00-05') TO ('2027-03-01 00:00:00-05');


--
-- TOC entry 7428 (class 0 OID 0)
-- Name: registro_2027_03; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_03 FOR VALUES FROM ('2027-03-01 00:00:00-05') TO ('2027-04-01 00:00:00-05');


--
-- TOC entry 7429 (class 0 OID 0)
-- Name: registro_2027_04; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_04 FOR VALUES FROM ('2027-04-01 00:00:00-05') TO ('2027-05-01 00:00:00-05');


--
-- TOC entry 7430 (class 0 OID 0)
-- Name: registro_2027_05; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_05 FOR VALUES FROM ('2027-05-01 00:00:00-05') TO ('2027-06-01 00:00:00-05');


--
-- TOC entry 7431 (class 0 OID 0)
-- Name: registro_2027_06; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_06 FOR VALUES FROM ('2027-06-01 00:00:00-05') TO ('2027-07-01 00:00:00-05');


--
-- TOC entry 7432 (class 0 OID 0)
-- Name: registro_2027_07; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_07 FOR VALUES FROM ('2027-07-01 00:00:00-05') TO ('2027-08-01 00:00:00-05');


--
-- TOC entry 7433 (class 0 OID 0)
-- Name: registro_2027_08; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_08 FOR VALUES FROM ('2027-08-01 00:00:00-05') TO ('2027-09-01 00:00:00-05');


--
-- TOC entry 7434 (class 0 OID 0)
-- Name: registro_2027_09; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_09 FOR VALUES FROM ('2027-09-01 00:00:00-05') TO ('2027-10-01 00:00:00-05');


--
-- TOC entry 7435 (class 0 OID 0)
-- Name: registro_2027_10; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_10 FOR VALUES FROM ('2027-10-01 00:00:00-05') TO ('2027-11-01 00:00:00-05');


--
-- TOC entry 7436 (class 0 OID 0)
-- Name: registro_2027_11; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_11 FOR VALUES FROM ('2027-11-01 00:00:00-05') TO ('2027-12-01 00:00:00-05');


--
-- TOC entry 7437 (class 0 OID 0)
-- Name: registro_2027_12; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_2027_12 FOR VALUES FROM ('2027-12-01 00:00:00-05') TO ('2028-01-01 00:00:00-05');


--
-- TOC entry 7438 (class 0 OID 0)
-- Name: registro_default; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro ATTACH PARTITION audit.registro_default DEFAULT;


--
-- TOC entry 7439 (class 0 OID 0)
-- Name: sesion_2026_04; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_2026_04 FOR VALUES FROM ('2026-04-01 00:00:00-05') TO ('2026-05-01 00:00:00-05');


--
-- TOC entry 7440 (class 0 OID 0)
-- Name: sesion_2026_05; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_2026_05 FOR VALUES FROM ('2026-05-01 00:00:00-05') TO ('2026-06-01 00:00:00-05');


--
-- TOC entry 7441 (class 0 OID 0)
-- Name: sesion_2026_06; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_2026_06 FOR VALUES FROM ('2026-06-01 00:00:00-05') TO ('2026-07-01 00:00:00-05');


--
-- TOC entry 7442 (class 0 OID 0)
-- Name: sesion_2026_07; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_2026_07 FOR VALUES FROM ('2026-07-01 00:00:00-05') TO ('2026-08-01 00:00:00-05');


--
-- TOC entry 7443 (class 0 OID 0)
-- Name: sesion_default; Type: TABLE ATTACH; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion ATTACH PARTITION audit.sesion_default DEFAULT;


--
-- TOC entry 7448 (class 2604 OID 188721)
-- Name: catalogo_concepto_factura id; Type: DEFAULT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.catalogo_concepto_factura ALTER COLUMN id SET DEFAULT nextval('acometidas.catalogo_concepto_factura_id_seq'::regclass);


--
-- TOC entry 7452 (class 2604 OID 188722)
-- Name: catalogo_tipo_documento id; Type: DEFAULT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.catalogo_tipo_documento ALTER COLUMN id SET DEFAULT nextval('acometidas.catalogo_tipo_documento_id_seq'::regclass);


--
-- TOC entry 7810 (class 2604 OID 188723)
-- Name: regla_alerta regla_id; Type: DEFAULT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.regla_alerta ALTER COLUMN regla_id SET DEFAULT nextval('audit.regla_alerta_regla_id_seq'::regclass);


--
-- TOC entry 8126 (class 2604 OID 190804)
-- Name: auditoria_lectura_sector audit_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditoria_lectura_sector ALTER COLUMN audit_id SET DEFAULT nextval('public.auditoria_lectura_sector_audit_id_seq'::regclass);


--
-- TOC entry 7844 (class 2604 OID 188724)
-- Name: cargo cargo_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cargo ALTER COLUMN cargo_id SET DEFAULT nextval('public.cargo_cargo_id_seq'::regclass);


--
-- TOC entry 7849 (class 2604 OID 188725)
-- Name: categoria categoria_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria ALTER COLUMN categoria_id SET DEFAULT nextval('public.categoria_categoria_id_seq'::regclass);


--
-- TOC entry 7857 (class 2604 OID 188726)
-- Name: claves_sql2000 id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claves_sql2000 ALTER COLUMN id SET DEFAULT nextval('public.claves_sql2000_id_seq'::regclass);


--
-- TOC entry 7872 (class 2604 OID 188727)
-- Name: cliente_persona_natural cliente_persona_natural_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_persona_natural ALTER COLUMN cliente_persona_natural_id SET DEFAULT nextval('public.cliente_persona_natural_cliente_persona_natural_id_seq'::regclass);


--
-- TOC entry 7889 (class 2604 OID 188728)
-- Name: componentes_fijos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.componentes_fijos ALTER COLUMN id SET DEFAULT nextval('public.componentes_fijos_id_seq'::regclass);


--
-- TOC entry 7865 (class 2604 OID 188729)
-- Name: correo_electronico correo_electronico_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_electronico ALTER COLUMN correo_electronico_id SET DEFAULT nextval('public.correo_electronico_correo_electronico_id_seq'::regclass);


--
-- TOC entry 7895 (class 2604 OID 188730)
-- Name: correo_empresa correo_empresa_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_empresa ALTER COLUMN correo_empresa_id SET DEFAULT nextval('public.correo_empresa_correo_empresa_id_seq'::regclass);


--
-- TOC entry 7898 (class 2604 OID 188731)
-- Name: correo_persona_natural correo_persona_natural_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_persona_natural ALTER COLUMN correo_persona_natural_id SET DEFAULT nextval('public.correo_persona_natural_correo_persona_natural_id_seq'::regclass);


--
-- TOC entry 7901 (class 2604 OID 188732)
-- Name: direccion direccion_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direccion ALTER COLUMN direccion_id SET DEFAULT nextval('public.direccion_direccion_id_seq'::regclass);


--
-- TOC entry 7921 (class 2604 OID 188733)
-- Name: estado_civil estado_civil_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_civil ALTER COLUMN estado_civil_id SET DEFAULT nextval('public.estado_civil_estado_civil_id_seq'::regclass);


--
-- TOC entry 7924 (class 2604 OID 188734)
-- Name: estado_cliente_usuario estado_cliente_usuario_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_cliente_usuario ALTER COLUMN estado_cliente_usuario_id SET DEFAULT nextval('public.estado_cliente_usuario_estado_cliente_usuario_id_seq'::regclass);


--
-- TOC entry 7931 (class 2604 OID 188735)
-- Name: estado_empleado estado_empleado_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_empleado ALTER COLUMN estado_empleado_id SET DEFAULT nextval('public.estado_empleado_estado_empleado_id_seq'::regclass);


--
-- TOC entry 7935 (class 2604 OID 188736)
-- Name: estado_pago estado_pago_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_pago ALTER COLUMN estado_pago_id SET DEFAULT nextval('public.estado_pago_estado_pago_id_seq'::regclass);


--
-- TOC entry 7938 (class 2604 OID 188737)
-- Name: factura factura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factura ALTER COLUMN factura_id SET DEFAULT nextval('public.factura_factura_id_seq'::regclass);


--
-- TOC entry 7943 (class 2604 OID 188738)
-- Name: forma_pago forma_pago_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forma_pago ALTER COLUMN forma_pago_id SET DEFAULT nextval('public.forma_pago_forma_pago_id_seq'::regclass);


--
-- TOC entry 7946 (class 2604 OID 188739)
-- Name: foto_acometida foto_acometida_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foto_acometida ALTER COLUMN foto_acometida_id SET DEFAULT nextval('public.foto_acometida_foto_acometida_id_seq'::regclass);


--
-- TOC entry 7949 (class 2604 OID 188740)
-- Name: foto_lectura foto_lectura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foto_lectura ALTER COLUMN foto_lectura_id SET DEFAULT nextval('public.foto_lectura_foto_lectura_id_seq'::regclass);


--
-- TOC entry 8122 (class 2604 OID 190694)
-- Name: historial_estados_acometida id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_estados_acometida ALTER COLUMN id SET DEFAULT nextval('public.historial_estados_acometida_id_seq'::regclass);


--
-- TOC entry 7952 (class 2604 OID 188741)
-- Name: lectura lectura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura ALTER COLUMN lectura_id SET DEFAULT nextval('public.lectura_lectura_id_seq'::regclass);


--
-- TOC entry 7957 (class 2604 OID 188742)
-- Name: lectura_estado lectura_estado_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura_estado ALTER COLUMN lectura_estado_id SET DEFAULT nextval('public.lectura_estado_lectura_estado_id_seq'::regclass);


--
-- TOC entry 7963 (class 2604 OID 188743)
-- Name: observacion observacion_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion ALTER COLUMN observacion_id SET DEFAULT nextval('public.observacion_observacion_id_seq'::regclass);


--
-- TOC entry 7966 (class 2604 OID 188744)
-- Name: observacion_acometida observacion_acometida_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_acometida ALTER COLUMN observacion_acometida_id SET DEFAULT nextval('public.observacion_acometida_observacion_acometida_id_seq'::regclass);


--
-- TOC entry 7970 (class 2604 OID 188745)
-- Name: observacion_factura observacion_factura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_factura ALTER COLUMN observacion_factura_id SET DEFAULT nextval('public.observacion_factura_observacion_factura_id_seq'::regclass);


--
-- TOC entry 7974 (class 2604 OID 188746)
-- Name: observacion_lectura observacion_lectura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_lectura ALTER COLUMN observacion_lectura_id SET DEFAULT nextval('public.observacion_lectura_observacion_lectura_id_seq'::regclass);


--
-- TOC entry 7982 (class 2604 OID 188747)
-- Name: permiso_categoria categoria_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso_categoria ALTER COLUMN categoria_id SET DEFAULT nextval('public.permiso_categoria_categoria_id_seq'::regclass);


--
-- TOC entry 7986 (class 2604 OID 188748)
-- Name: permisos permiso_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permisos ALTER COLUMN permiso_id SET DEFAULT nextval('public.permisos_permiso_id_seq'::regclass);


--
-- TOC entry 7994 (class 2604 OID 188749)
-- Name: profesion profesion_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profesion ALTER COLUMN profesion_id SET DEFAULT nextval('public.profesion_profesion_id_seq'::regclass);


--
-- TOC entry 7999 (class 2604 OID 188750)
-- Name: qrcode qrcode_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qrcode ALTER COLUMN qrcode_id SET DEFAULT nextval('public.qrcode_qrcode_id_seq'::regclass);


--
-- TOC entry 8002 (class 2604 OID 188751)
-- Name: rangos_variables id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rangos_variables ALTER COLUMN id SET DEFAULT nextval('public.rangos_variables_id_seq'::regclass);


--
-- TOC entry 8005 (class 2604 OID 188752)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 8117 (class 2604 OID 190625)
-- Name: respaldo_acometidas_2026 id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.respaldo_acometidas_2026 ALTER COLUMN id SET DEFAULT nextval('public.respaldo_acometidas_2026_id_seq'::regclass);


--
-- TOC entry 8011 (class 2604 OID 188753)
-- Name: rol_permisos rol_permiso_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permisos ALTER COLUMN rol_permiso_id SET DEFAULT nextval('public.rol_permisos_rol_permiso_id_seq'::regclass);


--
-- TOC entry 8014 (class 2604 OID 188754)
-- Name: roles rol_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN rol_id SET DEFAULT nextval('public.roles_rol_id_seq'::regclass);


--
-- TOC entry 8019 (class 2604 OID 188755)
-- Name: seguimiento_lectura seguimiento_lectura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguimiento_lectura ALTER COLUMN seguimiento_lectura_id SET DEFAULT nextval('public.seguimiento_lectura_seguimiento_lectura_id_seq'::regclass);


--
-- TOC entry 8023 (class 2604 OID 188756)
-- Name: servicio servicio_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio ALTER COLUMN servicio_id SET DEFAULT nextval('public.servicio_servicio_id_seq'::regclass);


--
-- TOC entry 8026 (class 2604 OID 188757)
-- Name: sexo sexo_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sexo ALTER COLUMN sexo_id SET DEFAULT nextval('public.sexo_sexo_id_seq'::regclass);


--
-- TOC entry 8029 (class 2604 OID 188758)
-- Name: siguiente_lectura siguiente_lectura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.siguiente_lectura ALTER COLUMN siguiente_lectura_id SET DEFAULT nextval('public.siguiente_lectura_siguiente_lectura_id_seq'::regclass);


--
-- TOC entry 8034 (class 2604 OID 188759)
-- Name: tarifa tarifa_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tarifa ALTER COLUMN tarifa_id SET DEFAULT nextval('public.tarifa_tarifa_id_seq'::regclass);


--
-- TOC entry 7868 (class 2604 OID 188760)
-- Name: telefono telefono_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono ALTER COLUMN telefono_id SET DEFAULT nextval('public.telefono_telefono_id_seq'::regclass);


--
-- TOC entry 8037 (class 2604 OID 188761)
-- Name: telefono_empresa telefono_empresa_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono_empresa ALTER COLUMN telefono_empresa_id SET DEFAULT nextval('public.telefono_empresa_telefono_empresa_id_seq'::regclass);


--
-- TOC entry 8040 (class 2604 OID 188762)
-- Name: telefono_persona_natural telefono_persona_natural_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono_persona_natural ALTER COLUMN telefono_persona_natural_id SET DEFAULT nextval('public.telefono_persona_natural_telefono_persona_natural_id_seq'::regclass);


--
-- TOC entry 8043 (class 2604 OID 188763)
-- Name: tipo_contrato tipo_contrato_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_contrato ALTER COLUMN tipo_contrato_id SET DEFAULT nextval('public.tipo_contrato_tipo_contrato_id_seq'::regclass);


--
-- TOC entry 8046 (class 2604 OID 188764)
-- Name: tipo_estado_lectura tipo_estado_lectura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_estado_lectura ALTER COLUMN tipo_estado_lectura_id SET DEFAULT nextval('public.tipo_estado_lectura_tipo_estado_lectura_id_seq'::regclass);


--
-- TOC entry 8052 (class 2604 OID 188765)
-- Name: tipo_novedad_lectura tipo_novedad_lectura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_novedad_lectura ALTER COLUMN tipo_novedad_lectura_id SET DEFAULT nextval('public.tipo_novedad_lectura_tipo_novedad_lectura_id_seq'::regclass);


--
-- TOC entry 8057 (class 2604 OID 188766)
-- Name: tipo_predio tipo_predio_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_predio ALTER COLUMN tipo_predio_id SET DEFAULT nextval('public.tipo_predio_tipo_predio_id_seq'::regclass);


--
-- TOC entry 8060 (class 2604 OID 188767)
-- Name: tipo_relacion_familiar tipo_relacion_familiar_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_relacion_familiar ALTER COLUMN tipo_relacion_familiar_id SET DEFAULT nextval('public.tipo_relacion_familiar_tipo_relacion_familiar_id_seq'::regclass);


--
-- TOC entry 8063 (class 2604 OID 188768)
-- Name: tipo_telefono tipo_telefono_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_telefono ALTER COLUMN tipo_telefono_id SET DEFAULT nextval('public.tipo_telefono_tipo_telefono_id_seq'::regclass);


--
-- TOC entry 8066 (class 2604 OID 188769)
-- Name: tipo_titulo_dato tipo_titulo_dato_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_titulo_dato ALTER COLUMN tipo_titulo_dato_id SET DEFAULT nextval('public.tipo_titulo_dato_tipo_titulo_dato_id_seq'::regclass);


--
-- TOC entry 8069 (class 2604 OID 188770)
-- Name: titulo_dato titulo_dato_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.titulo_dato ALTER COLUMN titulo_dato_id SET DEFAULT nextval('public.titulo_dato_titulo_dato_id_seq'::regclass);


--
-- TOC entry 8073 (class 2604 OID 188771)
-- Name: usuario_factura usuario_factura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_factura ALTER COLUMN usuario_factura_id SET DEFAULT nextval('public.usuario_factura_usuario_factura_id_seq'::regclass);


--
-- TOC entry 8077 (class 2604 OID 188772)
-- Name: usuario_lectura usuario_lectura_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_lectura ALTER COLUMN usuario_lectura_id SET DEFAULT nextval('public.usuario_lectura_usuario_lectura_id_seq'::regclass);


--
-- TOC entry 8082 (class 2604 OID 188773)
-- Name: usuario_permisos usuario_permiso_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_permisos ALTER COLUMN usuario_permiso_id SET DEFAULT nextval('public.usuario_permisos_usuario_permiso_id_seq'::regclass);


--
-- TOC entry 8086 (class 2604 OID 188774)
-- Name: usuario_roles usuario_rol_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_roles ALTER COLUMN usuario_rol_id SET DEFAULT nextval('public.usuario_roles_usuario_rol_id_seq'::regclass);


--
-- TOC entry 8090 (class 2604 OID 188775)
-- Name: zona zona_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zona ALTER COLUMN zona_id SET DEFAULT nextval('public.zona_zona_id_seq'::regclass);


--
-- TOC entry 8093 (class 2604 OID 188776)
-- Name: adjuntos_orden_trabajo id_adjunto; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.adjuntos_orden_trabajo ALTER COLUMN id_adjunto SET DEFAULT nextval('work_orders.adjuntos_orden_trabajo_id_adjunto_seq'::regclass);


--
-- TOC entry 8095 (class 2604 OID 188777)
-- Name: asignacion_orden_trabajo_trabajador id_asignacion; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.asignacion_orden_trabajo_trabajador ALTER COLUMN id_asignacion SET DEFAULT nextval('work_orders.asignacion_orden_trabajo_trabajador_id_asignacion_seq'::regclass);


--
-- TOC entry 8100 (class 2604 OID 188778)
-- Name: departamento_trabajo id_departamento; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.departamento_trabajo ALTER COLUMN id_departamento SET DEFAULT nextval('work_orders.departamento_trabajo_id_departamento_seq'::regclass);


--
-- TOC entry 8101 (class 2604 OID 188779)
-- Name: detalle_orden_trabajo_material id_detalle_orden_trabajo_material; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.detalle_orden_trabajo_material ALTER COLUMN id_detalle_orden_trabajo_material SET DEFAULT nextval('work_orders.detalle_orden_trabajo_materia_id_detalle_orden_trabajo_mate_seq'::regclass);


--
-- TOC entry 8103 (class 2604 OID 188780)
-- Name: detalle_prioridad id_detalle_prioridad; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.detalle_prioridad ALTER COLUMN id_detalle_prioridad SET DEFAULT nextval('work_orders.detalle_prioridad_id_detalle_prioridad_seq'::regclass);


--
-- TOC entry 8104 (class 2604 OID 188781)
-- Name: detalle_tipo_trabajo id_detalle_tipo_trabajo; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.detalle_tipo_trabajo ALTER COLUMN id_detalle_tipo_trabajo SET DEFAULT nextval('work_orders.detalle_tipo_trabajo_id_detalle_tipo_trabajo_seq'::regclass);


--
-- TOC entry 8105 (class 2604 OID 188782)
-- Name: estado_orden_trabajo id_estado; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.estado_orden_trabajo ALTER COLUMN id_estado SET DEFAULT nextval('work_orders.estado_orden_trabajo_id_estado_seq'::regclass);


--
-- TOC entry 8106 (class 2604 OID 188783)
-- Name: historial_estado_orden_trabajo id_historial; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo ALTER COLUMN id_historial SET DEFAULT nextval('work_orders.historial_estado_orden_trabajo_id_historial_seq'::regclass);


--
-- TOC entry 8108 (class 2604 OID 188784)
-- Name: observaciones_orden_trabajo id_observacion; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.observaciones_orden_trabajo ALTER COLUMN id_observacion SET DEFAULT nextval('work_orders.observaciones_orden_trabajo_id_observacion_seq'::regclass);


--
-- TOC entry 8114 (class 2604 OID 188785)
-- Name: prioridad_orden_trabajo id_prioridad; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.prioridad_orden_trabajo ALTER COLUMN id_prioridad SET DEFAULT nextval('work_orders.prioridad_orden_trabajo_id_prioridad_seq'::regclass);


--
-- TOC entry 8115 (class 2604 OID 188786)
-- Name: rol_trabajador id_rol; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.rol_trabajador ALTER COLUMN id_rol SET DEFAULT nextval('work_orders.rol_trabajador_id_rol_seq'::regclass);


--
-- TOC entry 8116 (class 2604 OID 188787)
-- Name: tipo_trabajo id_tipo_trabajo; Type: DEFAULT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.tipo_trabajo ALTER COLUMN id_tipo_trabajo SET DEFAULT nextval('work_orders.tipo_trabajo_id_tipo_trabajo_seq'::regclass);


--
-- TOC entry 8158 (class 2606 OID 188789)
-- Name: catalogo_concepto_factura catalogo_concepto_factura_codigo_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.catalogo_concepto_factura
    ADD CONSTRAINT catalogo_concepto_factura_codigo_key UNIQUE (codigo);


--
-- TOC entry 8160 (class 2606 OID 188791)
-- Name: catalogo_concepto_factura catalogo_concepto_factura_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.catalogo_concepto_factura
    ADD CONSTRAINT catalogo_concepto_factura_pkey PRIMARY KEY (id);


--
-- TOC entry 8162 (class 2606 OID 188793)
-- Name: catalogo_tipo_documento catalogo_tipo_documento_codigo_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.catalogo_tipo_documento
    ADD CONSTRAINT catalogo_tipo_documento_codigo_key UNIQUE (codigo);


--
-- TOC entry 8164 (class 2606 OID 188795)
-- Name: catalogo_tipo_documento catalogo_tipo_documento_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.catalogo_tipo_documento
    ADD CONSTRAINT catalogo_tipo_documento_pkey PRIMARY KEY (id);


--
-- TOC entry 8166 (class 2606 OID 188797)
-- Name: contrato_servicio contrato_servicio_id_solicitud_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_solicitud_key UNIQUE (id_solicitud);


--
-- TOC entry 8168 (class 2606 OID 188799)
-- Name: contrato_servicio contrato_servicio_numero_contrato_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_numero_contrato_key UNIQUE (numero_contrato);


--
-- TOC entry 8170 (class 2606 OID 188801)
-- Name: contrato_servicio contrato_servicio_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_pkey PRIMARY KEY (id_contrato);


--
-- TOC entry 8172 (class 2606 OID 188803)
-- Name: documento_adjunto documento_adjunto_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.documento_adjunto
    ADD CONSTRAINT documento_adjunto_pkey PRIMARY KEY (id_documento);


--
-- TOC entry 8176 (class 2606 OID 188805)
-- Name: factura_inspeccion factura_inspeccion_id_solicitud_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_id_solicitud_key UNIQUE (id_solicitud);


--
-- TOC entry 8178 (class 2606 OID 188807)
-- Name: factura_inspeccion factura_inspeccion_numero_factura_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_numero_factura_key UNIQUE (numero_factura);


--
-- TOC entry 8180 (class 2606 OID 188809)
-- Name: factura_inspeccion factura_inspeccion_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_pkey PRIMARY KEY (id_factura);


--
-- TOC entry 8182 (class 2606 OID 188811)
-- Name: historial_estado historial_estado_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.historial_estado
    ADD CONSTRAINT historial_estado_pkey PRIMARY KEY (id_historial);


--
-- TOC entry 8186 (class 2606 OID 188813)
-- Name: informe_inspeccion informe_inspeccion_id_orden_trabajo_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_id_orden_trabajo_key UNIQUE (id_orden_trabajo);


--
-- TOC entry 8188 (class 2606 OID 188815)
-- Name: informe_inspeccion informe_inspeccion_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_pkey PRIMARY KEY (id_informe);


--
-- TOC entry 8190 (class 2606 OID 188817)
-- Name: inventario_medidor inventario_medidor_numero_serie_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.inventario_medidor
    ADD CONSTRAINT inventario_medidor_numero_serie_key UNIQUE (numero_serie);


--
-- TOC entry 8192 (class 2606 OID 188819)
-- Name: inventario_medidor inventario_medidor_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.inventario_medidor
    ADD CONSTRAINT inventario_medidor_pkey PRIMARY KEY (id_medidor);


--
-- TOC entry 8197 (class 2606 OID 188821)
-- Name: notificacion notificacion_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.notificacion
    ADD CONSTRAINT notificacion_pkey PRIMARY KEY (id_notificacion);


--
-- TOC entry 8202 (class 2606 OID 188823)
-- Name: registro_catastral registro_catastral_id_solicitud_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_id_solicitud_key UNIQUE (id_solicitud);


--
-- TOC entry 8204 (class 2606 OID 188825)
-- Name: registro_catastral registro_catastral_numero_cuenta_key; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_numero_cuenta_key UNIQUE (numero_cuenta);


--
-- TOC entry 8206 (class 2606 OID 188827)
-- Name: registro_catastral registro_catastral_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_pkey PRIMARY KEY (id_registro);


--
-- TOC entry 8217 (class 2606 OID 188829)
-- Name: solicitud_orden_trabajo solicitud_orden_trabajo_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.solicitud_orden_trabajo
    ADD CONSTRAINT solicitud_orden_trabajo_pkey PRIMARY KEY (id_solicitud, id_orden_trabajo);


--
-- TOC entry 8213 (class 2606 OID 188831)
-- Name: solicitud solicitud_pkey; Type: CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_pkey PRIMARY KEY (id_solicitud);


--
-- TOC entry 8227 (class 2606 OID 188833)
-- Name: alerta alerta_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.alerta
    ADD CONSTRAINT alerta_pkey PRIMARY KEY (alerta_id);


--
-- TOC entry 8240 (class 2606 OID 188835)
-- Name: registro registro_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro
    ADD CONSTRAINT registro_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8246 (class 2606 OID 188837)
-- Name: registro_2024_01 registro_2024_01_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_01
    ADD CONSTRAINT registro_2024_01_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8255 (class 2606 OID 188839)
-- Name: registro_2024_02 registro_2024_02_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_02
    ADD CONSTRAINT registro_2024_02_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8264 (class 2606 OID 188841)
-- Name: registro_2024_03 registro_2024_03_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_03
    ADD CONSTRAINT registro_2024_03_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8273 (class 2606 OID 188843)
-- Name: registro_2024_04 registro_2024_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_04
    ADD CONSTRAINT registro_2024_04_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8282 (class 2606 OID 188845)
-- Name: registro_2024_05 registro_2024_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_05
    ADD CONSTRAINT registro_2024_05_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8291 (class 2606 OID 188847)
-- Name: registro_2024_06 registro_2024_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_06
    ADD CONSTRAINT registro_2024_06_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8300 (class 2606 OID 188849)
-- Name: registro_2024_07 registro_2024_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_07
    ADD CONSTRAINT registro_2024_07_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8309 (class 2606 OID 188851)
-- Name: registro_2024_08 registro_2024_08_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_08
    ADD CONSTRAINT registro_2024_08_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8318 (class 2606 OID 188853)
-- Name: registro_2024_09 registro_2024_09_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_09
    ADD CONSTRAINT registro_2024_09_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8327 (class 2606 OID 188855)
-- Name: registro_2024_10 registro_2024_10_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_10
    ADD CONSTRAINT registro_2024_10_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8336 (class 2606 OID 188857)
-- Name: registro_2024_11 registro_2024_11_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_11
    ADD CONSTRAINT registro_2024_11_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8345 (class 2606 OID 188859)
-- Name: registro_2024_12 registro_2024_12_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2024_12
    ADD CONSTRAINT registro_2024_12_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8354 (class 2606 OID 188861)
-- Name: registro_2025_01 registro_2025_01_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_01
    ADD CONSTRAINT registro_2025_01_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8363 (class 2606 OID 188863)
-- Name: registro_2025_02 registro_2025_02_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_02
    ADD CONSTRAINT registro_2025_02_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8372 (class 2606 OID 188865)
-- Name: registro_2025_03 registro_2025_03_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_03
    ADD CONSTRAINT registro_2025_03_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8381 (class 2606 OID 188867)
-- Name: registro_2025_04 registro_2025_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_04
    ADD CONSTRAINT registro_2025_04_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8390 (class 2606 OID 188869)
-- Name: registro_2025_05 registro_2025_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_05
    ADD CONSTRAINT registro_2025_05_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8399 (class 2606 OID 188871)
-- Name: registro_2025_06 registro_2025_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_06
    ADD CONSTRAINT registro_2025_06_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8408 (class 2606 OID 188873)
-- Name: registro_2025_07 registro_2025_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_07
    ADD CONSTRAINT registro_2025_07_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8417 (class 2606 OID 188875)
-- Name: registro_2025_08 registro_2025_08_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_08
    ADD CONSTRAINT registro_2025_08_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8426 (class 2606 OID 188877)
-- Name: registro_2025_09 registro_2025_09_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_09
    ADD CONSTRAINT registro_2025_09_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8435 (class 2606 OID 188879)
-- Name: registro_2025_10 registro_2025_10_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_10
    ADD CONSTRAINT registro_2025_10_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8444 (class 2606 OID 188881)
-- Name: registro_2025_11 registro_2025_11_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_11
    ADD CONSTRAINT registro_2025_11_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8453 (class 2606 OID 188883)
-- Name: registro_2025_12 registro_2025_12_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2025_12
    ADD CONSTRAINT registro_2025_12_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8462 (class 2606 OID 188885)
-- Name: registro_2026_01 registro_2026_01_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_01
    ADD CONSTRAINT registro_2026_01_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8471 (class 2606 OID 188887)
-- Name: registro_2026_02 registro_2026_02_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_02
    ADD CONSTRAINT registro_2026_02_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8480 (class 2606 OID 188889)
-- Name: registro_2026_03 registro_2026_03_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_03
    ADD CONSTRAINT registro_2026_03_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8489 (class 2606 OID 188891)
-- Name: registro_2026_04 registro_2026_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_04
    ADD CONSTRAINT registro_2026_04_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8498 (class 2606 OID 188893)
-- Name: registro_2026_05 registro_2026_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_05
    ADD CONSTRAINT registro_2026_05_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8507 (class 2606 OID 188895)
-- Name: registro_2026_06 registro_2026_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_06
    ADD CONSTRAINT registro_2026_06_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8516 (class 2606 OID 188897)
-- Name: registro_2026_07 registro_2026_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_07
    ADD CONSTRAINT registro_2026_07_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8525 (class 2606 OID 188899)
-- Name: registro_2026_08 registro_2026_08_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_08
    ADD CONSTRAINT registro_2026_08_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8534 (class 2606 OID 188901)
-- Name: registro_2026_09 registro_2026_09_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_09
    ADD CONSTRAINT registro_2026_09_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8543 (class 2606 OID 188903)
-- Name: registro_2026_10 registro_2026_10_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_10
    ADD CONSTRAINT registro_2026_10_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8552 (class 2606 OID 188905)
-- Name: registro_2026_11 registro_2026_11_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_11
    ADD CONSTRAINT registro_2026_11_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8561 (class 2606 OID 188907)
-- Name: registro_2026_12 registro_2026_12_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2026_12
    ADD CONSTRAINT registro_2026_12_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8570 (class 2606 OID 188909)
-- Name: registro_2027_01 registro_2027_01_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_01
    ADD CONSTRAINT registro_2027_01_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8579 (class 2606 OID 188911)
-- Name: registro_2027_02 registro_2027_02_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_02
    ADD CONSTRAINT registro_2027_02_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8588 (class 2606 OID 188913)
-- Name: registro_2027_03 registro_2027_03_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_03
    ADD CONSTRAINT registro_2027_03_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8597 (class 2606 OID 188915)
-- Name: registro_2027_04 registro_2027_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_04
    ADD CONSTRAINT registro_2027_04_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8606 (class 2606 OID 188917)
-- Name: registro_2027_05 registro_2027_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_05
    ADD CONSTRAINT registro_2027_05_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8615 (class 2606 OID 188919)
-- Name: registro_2027_06 registro_2027_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_06
    ADD CONSTRAINT registro_2027_06_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8624 (class 2606 OID 188921)
-- Name: registro_2027_07 registro_2027_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_07
    ADD CONSTRAINT registro_2027_07_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8633 (class 2606 OID 188923)
-- Name: registro_2027_08 registro_2027_08_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_08
    ADD CONSTRAINT registro_2027_08_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8642 (class 2606 OID 188925)
-- Name: registro_2027_09 registro_2027_09_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_09
    ADD CONSTRAINT registro_2027_09_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8651 (class 2606 OID 188927)
-- Name: registro_2027_10 registro_2027_10_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_10
    ADD CONSTRAINT registro_2027_10_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8660 (class 2606 OID 188929)
-- Name: registro_2027_11 registro_2027_11_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_11
    ADD CONSTRAINT registro_2027_11_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8669 (class 2606 OID 188931)
-- Name: registro_2027_12 registro_2027_12_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_2027_12
    ADD CONSTRAINT registro_2027_12_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8678 (class 2606 OID 188933)
-- Name: registro_default registro_default_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.registro_default
    ADD CONSTRAINT registro_default_pkey PRIMARY KEY (audit_id, audit_timestamp);


--
-- TOC entry 8683 (class 2606 OID 188935)
-- Name: regla_alerta regla_alerta_codigo_key; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.regla_alerta
    ADD CONSTRAINT regla_alerta_codigo_key UNIQUE (codigo);


--
-- TOC entry 8685 (class 2606 OID 188937)
-- Name: regla_alerta regla_alerta_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.regla_alerta
    ADD CONSTRAINT regla_alerta_pkey PRIMARY KEY (regla_id);


--
-- TOC entry 8690 (class 2606 OID 188939)
-- Name: sesion sesion_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion
    ADD CONSTRAINT sesion_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- TOC entry 8694 (class 2606 OID 188941)
-- Name: sesion_2026_04 sesion_2026_04_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion_2026_04
    ADD CONSTRAINT sesion_2026_04_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- TOC entry 8699 (class 2606 OID 188943)
-- Name: sesion_2026_05 sesion_2026_05_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion_2026_05
    ADD CONSTRAINT sesion_2026_05_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- TOC entry 8704 (class 2606 OID 188945)
-- Name: sesion_2026_06 sesion_2026_06_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion_2026_06
    ADD CONSTRAINT sesion_2026_06_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- TOC entry 8709 (class 2606 OID 188947)
-- Name: sesion_2026_07 sesion_2026_07_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion_2026_07
    ADD CONSTRAINT sesion_2026_07_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- TOC entry 8714 (class 2606 OID 188949)
-- Name: sesion_default sesion_default_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.sesion_default
    ADD CONSTRAINT sesion_default_pkey PRIMARY KEY (sesion_log_id, audit_timestamp);


--
-- TOC entry 8717 (class 2606 OID 188951)
-- Name: tabla_config tabla_config_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.tabla_config
    ADD CONSTRAINT tabla_config_pkey PRIMARY KEY (tabla_nombre);


--
-- TOC entry 8722 (class 2606 OID 188953)
-- Name: usuario_refresh_tokens usuario_refresh_tokens_pkey; Type: CONSTRAINT; Schema: audit; Owner: -
--

ALTER TABLE ONLY audit.usuario_refresh_tokens
    ADD CONSTRAINT usuario_refresh_tokens_pkey PRIMARY KEY (token_id);


--
-- TOC entry 8724 (class 2606 OID 188955)
-- Name: acometida acometida_clave_catastral_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT acometida_clave_catastral_key UNIQUE (clave_catastral);


--
-- TOC entry 9154 (class 2606 OID 190818)
-- Name: auditoria_lectura_sector auditoria_lectura_sector_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditoria_lectura_sector
    ADD CONSTRAINT auditoria_lectura_sector_pkey PRIMARY KEY (audit_id);


--
-- TOC entry 8739 (class 2606 OID 188957)
-- Name: cargo cargo_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_nombre_key UNIQUE (nombre);


--
-- TOC entry 8741 (class 2606 OID 188959)
-- Name: cargo cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_pkey PRIMARY KEY (cargo_id);


--
-- TOC entry 9147 (class 2606 OID 190689)
-- Name: cat_estados_acometida cat_estados_acometida_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_estados_acometida
    ADD CONSTRAINT cat_estados_acometida_nombre_key UNIQUE (nombre);


--
-- TOC entry 9149 (class 2606 OID 190687)
-- Name: cat_estados_acometida cat_estados_acometida_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cat_estados_acometida
    ADD CONSTRAINT cat_estados_acometida_pkey PRIMARY KEY (id_estado);


--
-- TOC entry 8743 (class 2606 OID 188961)
-- Name: categoria categoria_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_nombre_key UNIQUE (nombre);


--
-- TOC entry 8756 (class 2606 OID 188963)
-- Name: claves_sql2000 claves_sql2000_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claves_sql2000
    ADD CONSTRAINT claves_sql2000_pkey PRIMARY KEY (id);


--
-- TOC entry 8774 (class 2606 OID 188965)
-- Name: cliente_usuario cliente_usuario_cliente_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_cliente_id_key UNIQUE (cliente_id);


--
-- TOC entry 8776 (class 2606 OID 188967)
-- Name: cliente_usuario cliente_usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_email_key UNIQUE (email);


--
-- TOC entry 8778 (class 2606 OID 188969)
-- Name: cliente_usuario cliente_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_pkey PRIMARY KEY (cliente_usuario_id);


--
-- TOC entry 8788 (class 2606 OID 188971)
-- Name: componentes_fijos componentes_fijos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.componentes_fijos
    ADD CONSTRAINT componentes_fijos_pkey PRIMARY KEY (id);


--
-- TOC entry 8792 (class 2606 OID 188973)
-- Name: consumo_promedio consumo_promedio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consumo_promedio
    ADD CONSTRAINT consumo_promedio_pkey PRIMARY KEY (acometida_id);


--
-- TOC entry 8806 (class 2606 OID 188975)
-- Name: empleado_zona empleado_zona_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleado_zona
    ADD CONSTRAINT empleado_zona_pkey PRIMARY KEY (empleado_id, zona_id);


--
-- TOC entry 8808 (class 2606 OID 188977)
-- Name: empleados empleados_cedula_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_cedula_key UNIQUE (cedula);


--
-- TOC entry 8810 (class 2606 OID 188979)
-- Name: empleados empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_pkey PRIMARY KEY (empleado_id);


--
-- TOC entry 8812 (class 2606 OID 188981)
-- Name: empleados empleados_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_usuario_id_key UNIQUE (usuario_id);


--
-- TOC entry 8832 (class 2606 OID 188983)
-- Name: estado_cliente_usuario estado_cliente_usuario_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_cliente_usuario
    ADD CONSTRAINT estado_cliente_usuario_codigo_key UNIQUE (codigo);


--
-- TOC entry 8834 (class 2606 OID 188985)
-- Name: estado_cliente_usuario estado_cliente_usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_cliente_usuario
    ADD CONSTRAINT estado_cliente_usuario_pkey PRIMARY KEY (estado_cliente_usuario_id);


--
-- TOC entry 8836 (class 2606 OID 188987)
-- Name: estado_empleado estado_empleado_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_empleado
    ADD CONSTRAINT estado_empleado_codigo_key UNIQUE (codigo);


--
-- TOC entry 8838 (class 2606 OID 188989)
-- Name: estado_empleado estado_empleado_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_empleado
    ADD CONSTRAINT estado_empleado_pkey PRIMARY KEY (estado_empleado_id);


--
-- TOC entry 9151 (class 2606 OID 190702)
-- Name: historial_estados_acometida historial_estados_acometida_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_estados_acometida
    ADD CONSTRAINT historial_estados_acometida_pkey PRIMARY KEY (id);


--
-- TOC entry 8875 (class 2606 OID 188991)
-- Name: lectura_estado lectura_estado_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura_estado
    ADD CONSTRAINT lectura_estado_codigo_key UNIQUE (codigo);


--
-- TOC entry 8907 (class 2606 OID 188993)
-- Name: permiso_categoria permiso_categoria_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso_categoria
    ADD CONSTRAINT permiso_categoria_nombre_key UNIQUE (nombre);


--
-- TOC entry 8909 (class 2606 OID 188995)
-- Name: permiso_categoria permiso_categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso_categoria
    ADD CONSTRAINT permiso_categoria_pkey PRIMARY KEY (categoria_id);


--
-- TOC entry 8912 (class 2606 OID 188997)
-- Name: permisos permisos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_nombre_key UNIQUE (nombre);


--
-- TOC entry 8914 (class 2606 OID 188999)
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (permiso_id);


--
-- TOC entry 8733 (class 2606 OID 189001)
-- Name: acometida pk_acometida; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT pk_acometida PRIMARY KEY (acometida_id);


--
-- TOC entry 8737 (class 2606 OID 189003)
-- Name: canton pk_canton; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canton
    ADD CONSTRAINT pk_canton PRIMARY KEY (canton_id);


--
-- TOC entry 8746 (class 2606 OID 189005)
-- Name: categoria pk_categoria; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT pk_categoria PRIMARY KEY (categoria_id);


--
-- TOC entry 8754 (class 2606 OID 189007)
-- Name: ciudadano pk_ciudadano; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT pk_ciudadano PRIMARY KEY (ciudadano_id);


--
-- TOC entry 8759 (class 2606 OID 189009)
-- Name: cliente pk_cliente; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT pk_cliente PRIMARY KEY (cliente_id);


--
-- TOC entry 8772 (class 2606 OID 189011)
-- Name: cliente_persona_natural pk_cliente_persona_natural; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_persona_natural
    ADD CONSTRAINT pk_cliente_persona_natural PRIMARY KEY (cliente_persona_natural_id);


--
-- TOC entry 8763 (class 2606 OID 189013)
-- Name: correo_electronico pk_correo_electronico; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_electronico
    ADD CONSTRAINT pk_correo_electronico PRIMARY KEY (correo_electronico_id);


--
-- TOC entry 8797 (class 2606 OID 189015)
-- Name: correo_empresa pk_correo_empresa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_empresa
    ADD CONSTRAINT pk_correo_empresa PRIMARY KEY (correo_empresa_id);


--
-- TOC entry 8801 (class 2606 OID 189017)
-- Name: correo_persona_natural pk_correo_persona_natural; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_persona_natural
    ADD CONSTRAINT pk_correo_persona_natural PRIMARY KEY (correo_persona_natural_id);


--
-- TOC entry 8804 (class 2606 OID 189019)
-- Name: direccion pk_direccion; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direccion
    ADD CONSTRAINT pk_direccion PRIMARY KEY (direccion_id);


--
-- TOC entry 8825 (class 2606 OID 189021)
-- Name: empresa pk_empresa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT pk_empresa PRIMARY KEY (empresa_id);


--
-- TOC entry 8830 (class 2606 OID 189023)
-- Name: estado_civil pk_estado_civil; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_civil
    ADD CONSTRAINT pk_estado_civil PRIMARY KEY (estado_civil_id);


--
-- TOC entry 8841 (class 2606 OID 189025)
-- Name: estado_pago pk_estado_pago; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estado_pago
    ADD CONSTRAINT pk_estado_pago PRIMARY KEY (estado_pago_id);


--
-- TOC entry 8849 (class 2606 OID 189027)
-- Name: factura pk_factura; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT pk_factura PRIMARY KEY (factura_id);


--
-- TOC entry 8852 (class 2606 OID 189029)
-- Name: forma_pago pk_forma_pago; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.forma_pago
    ADD CONSTRAINT pk_forma_pago PRIMARY KEY (forma_pago_id);


--
-- TOC entry 8856 (class 2606 OID 189031)
-- Name: foto_acometida pk_foto_acometida; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foto_acometida
    ADD CONSTRAINT pk_foto_acometida PRIMARY KEY (foto_acometida_id);


--
-- TOC entry 8861 (class 2606 OID 189033)
-- Name: foto_lectura pk_foto_lectura; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foto_lectura
    ADD CONSTRAINT pk_foto_lectura PRIMARY KEY (foto_lectura_id);


--
-- TOC entry 8870 (class 2606 OID 189035)
-- Name: lectura pk_lectura; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura
    ADD CONSTRAINT pk_lectura PRIMARY KEY (lectura_id);


--
-- TOC entry 8877 (class 2606 OID 189037)
-- Name: lectura_estado pk_lectura_estado; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura_estado
    ADD CONSTRAINT pk_lectura_estado PRIMARY KEY (lectura_estado_id);


--
-- TOC entry 8882 (class 2606 OID 189039)
-- Name: observacion pk_observacion; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT pk_observacion PRIMARY KEY (observacion_id);


--
-- TOC entry 8887 (class 2606 OID 189041)
-- Name: observacion_acometida pk_observacion_acometida; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_acometida
    ADD CONSTRAINT pk_observacion_acometida PRIMARY KEY (observacion_acometida_id);


--
-- TOC entry 8892 (class 2606 OID 189043)
-- Name: observacion_factura pk_observacion_factura; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_factura
    ADD CONSTRAINT pk_observacion_factura PRIMARY KEY (observacion_factura_id);


--
-- TOC entry 8897 (class 2606 OID 189045)
-- Name: observacion_lectura pk_observacion_lectura; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_lectura
    ADD CONSTRAINT pk_observacion_lectura PRIMARY KEY (observacion_lectura_id);


--
-- TOC entry 8900 (class 2606 OID 189047)
-- Name: pais pk_pais; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pais
    ADD CONSTRAINT pk_pais PRIMARY KEY (pais_id);


--
-- TOC entry 8905 (class 2606 OID 189049)
-- Name: parroquia pk_parroquia; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parroquia
    ADD CONSTRAINT pk_parroquia PRIMARY KEY (parroquia_id);


--
-- TOC entry 8935 (class 2606 OID 189051)
-- Name: predio pk_predio; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predio
    ADD CONSTRAINT pk_predio PRIMARY KEY (predio_id);


--
-- TOC entry 8940 (class 2606 OID 189053)
-- Name: profesion pk_profesion; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profesion
    ADD CONSTRAINT pk_profesion PRIMARY KEY (profesion_id);


--
-- TOC entry 8944 (class 2606 OID 189055)
-- Name: provincia pk_provincia; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT pk_provincia PRIMARY KEY (provincia_id);


--
-- TOC entry 8986 (class 2606 OID 189057)
-- Name: servicio pk_servicio; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT pk_servicio PRIMARY KEY (servicio_id);


--
-- TOC entry 8991 (class 2606 OID 189059)
-- Name: sexo pk_sexo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sexo
    ADD CONSTRAINT pk_sexo PRIMARY KEY (sexo_id);


--
-- TOC entry 9003 (class 2606 OID 189061)
-- Name: tarifa pk_tarifa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tarifa
    ADD CONSTRAINT pk_tarifa PRIMARY KEY (tarifa_id);


--
-- TOC entry 8768 (class 2606 OID 189063)
-- Name: telefono pk_telefono; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT pk_telefono PRIMARY KEY (telefono_id);


--
-- TOC entry 9007 (class 2606 OID 189065)
-- Name: telefono_empresa pk_telefono_empresa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono_empresa
    ADD CONSTRAINT pk_telefono_empresa PRIMARY KEY (telefono_empresa_id);


--
-- TOC entry 9011 (class 2606 OID 189067)
-- Name: telefono_persona_natural pk_telefono_persona_natural; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono_persona_natural
    ADD CONSTRAINT pk_telefono_persona_natural PRIMARY KEY (telefono_persona_natural_id);


--
-- TOC entry 9019 (class 2606 OID 189069)
-- Name: tipo_estado_lectura pk_tipo_estado_lectura; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_estado_lectura
    ADD CONSTRAINT pk_tipo_estado_lectura PRIMARY KEY (tipo_estado_lectura_id);


--
-- TOC entry 9026 (class 2606 OID 189071)
-- Name: tipo_identificacion pk_tipo_identificacion; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_identificacion
    ADD CONSTRAINT pk_tipo_identificacion PRIMARY KEY (tipo_identificacion_id);


--
-- TOC entry 9029 (class 2606 OID 189073)
-- Name: tipo_novedad_lectura pk_tipo_novedad_lectura; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_novedad_lectura
    ADD CONSTRAINT pk_tipo_novedad_lectura PRIMARY KEY (tipo_novedad_lectura_id);


--
-- TOC entry 9034 (class 2606 OID 189075)
-- Name: tipo_parroquia pk_tipo_parroquia; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_parroquia
    ADD CONSTRAINT pk_tipo_parroquia PRIMARY KEY (tipo_parroquia_id);


--
-- TOC entry 9041 (class 2606 OID 189077)
-- Name: tipo_relacion_familiar pk_tipo_relacion_familiar; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_relacion_familiar
    ADD CONSTRAINT pk_tipo_relacion_familiar PRIMARY KEY (tipo_relacion_familiar_id);


--
-- TOC entry 9044 (class 2606 OID 189079)
-- Name: tipo_telefono pk_tipo_telefono; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_telefono
    ADD CONSTRAINT pk_tipo_telefono PRIMARY KEY (tipo_telefono_id);


--
-- TOC entry 9047 (class 2606 OID 189081)
-- Name: tipo_titulo_dato pk_tipo_titulo_dato; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_titulo_dato
    ADD CONSTRAINT pk_tipo_titulo_dato PRIMARY KEY (tipo_titulo_dato_id);


--
-- TOC entry 9036 (class 2606 OID 189083)
-- Name: tipo_predio pk_tipopredio; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_predio
    ADD CONSTRAINT pk_tipopredio PRIMARY KEY (tipo_predio_id);


--
-- TOC entry 9054 (class 2606 OID 189085)
-- Name: titulo_dato pk_titulo_dato; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.titulo_dato
    ADD CONSTRAINT pk_titulo_dato PRIMARY KEY (titulo_dato_id);


--
-- TOC entry 9059 (class 2606 OID 189087)
-- Name: usuario_factura pk_usuario_factura; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_factura
    ADD CONSTRAINT pk_usuario_factura PRIMARY KEY (usuario_factura_id);


--
-- TOC entry 9063 (class 2606 OID 189089)
-- Name: usuario_lectura pk_usuario_lectura; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_lectura
    ADD CONSTRAINT pk_usuario_lectura PRIMARY KEY (usuario_lectura_id);


--
-- TOC entry 9079 (class 2606 OID 189091)
-- Name: zona pk_zona; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zona
    ADD CONSTRAINT pk_zona PRIMARY KEY (zona_id);


--
-- TOC entry 8937 (class 2606 OID 189093)
-- Name: predio predio_clavecatastral_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predio
    ADD CONSTRAINT predio_clavecatastral_key UNIQUE (clave_catastral);


--
-- TOC entry 8948 (class 2606 OID 189095)
-- Name: qrcode qrcode_acometida_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qrcode
    ADD CONSTRAINT qrcode_acometida_id_key UNIQUE (acometida_id);


--
-- TOC entry 8950 (class 2606 OID 189097)
-- Name: qrcode qrcode_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qrcode
    ADD CONSTRAINT qrcode_pkey PRIMARY KEY (qrcode_id);


--
-- TOC entry 8954 (class 2606 OID 189099)
-- Name: rangos_variables rangos_variables_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rangos_variables
    ADD CONSTRAINT rangos_variables_pkey PRIMARY KEY (id);


--
-- TOC entry 8959 (class 2606 OID 189101)
-- Name: refresh_tokens refresh_tokens_jti_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_jti_key UNIQUE (jti);


--
-- TOC entry 8961 (class 2606 OID 189103)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 8963 (class 2606 OID 189105)
-- Name: refresh_tokens refresh_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 9145 (class 2606 OID 190631)
-- Name: respaldo_acometidas_2026 respaldo_acometidas_2026_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.respaldo_acometidas_2026
    ADD CONSTRAINT respaldo_acometidas_2026_pkey PRIMARY KEY (id);


--
-- TOC entry 8967 (class 2606 OID 189107)
-- Name: rol_permisos rol_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_pkey PRIMARY KEY (rol_permiso_id);


--
-- TOC entry 8969 (class 2606 OID 189109)
-- Name: rol_permisos rol_permisos_rol_id_permiso_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_rol_id_permiso_id_key UNIQUE (rol_id, permiso_id);


--
-- TOC entry 8973 (class 2606 OID 189111)
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- TOC entry 8975 (class 2606 OID 189113)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (rol_id);


--
-- TOC entry 8983 (class 2606 OID 189115)
-- Name: seguimiento_lectura seguimiento_lectura_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_pkey PRIMARY KEY (seguimiento_lectura_id);


--
-- TOC entry 8988 (class 2606 OID 189117)
-- Name: servicio servicio_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_nombre_key UNIQUE (nombre);


--
-- TOC entry 8997 (class 2606 OID 189119)
-- Name: siguiente_lectura siguiente_lectura_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.siguiente_lectura
    ADD CONSTRAINT siguiente_lectura_pkey PRIMARY KEY (siguiente_lectura_id);


--
-- TOC entry 9013 (class 2606 OID 189121)
-- Name: tipo_contrato tipo_contrato_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_contrato
    ADD CONSTRAINT tipo_contrato_nombre_key UNIQUE (nombre);


--
-- TOC entry 9015 (class 2606 OID 189123)
-- Name: tipo_contrato tipo_contrato_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_contrato
    ADD CONSTRAINT tipo_contrato_pkey PRIMARY KEY (tipo_contrato_id);


--
-- TOC entry 9021 (class 2606 OID 189125)
-- Name: tipo_estado_lectura tipo_estado_lectura_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_estado_lectura
    ADD CONSTRAINT tipo_estado_lectura_codigo_key UNIQUE (codigo);


--
-- TOC entry 9023 (class 2606 OID 189127)
-- Name: tipo_estado_lectura tipo_estado_lectura_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_estado_lectura
    ADD CONSTRAINT tipo_estado_lectura_nombre_key UNIQUE (nombre);


--
-- TOC entry 9031 (class 2606 OID 189129)
-- Name: tipo_novedad_lectura tipo_novedad_lectura_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_novedad_lectura
    ADD CONSTRAINT tipo_novedad_lectura_nombre_key UNIQUE (nombre);


--
-- TOC entry 9038 (class 2606 OID 189131)
-- Name: tipo_predio tipopredio_nombre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo_predio
    ADD CONSTRAINT tipopredio_nombre_key UNIQUE (nombre);


--
-- TOC entry 9157 (class 2606 OID 190820)
-- Name: auditoria_lectura_sector uq_audit_mes_sector; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auditoria_lectura_sector
    ADD CONSTRAINT uq_audit_mes_sector UNIQUE (mes_lectura, sector_id);


--
-- TOC entry 8827 (class 2606 OID 189133)
-- Name: empresa uq_empresa_ruc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT uq_empresa_ruc UNIQUE (ruc);


--
-- TOC entry 8879 (class 2606 OID 189135)
-- Name: lectura_estado uq_lectura_estado_nombre; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura_estado
    ADD CONSTRAINT uq_lectura_estado_nombre UNIQUE (nombre);


--
-- TOC entry 8999 (class 2606 OID 189137)
-- Name: siguiente_lectura uq_siguiente_lectura_acometida; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.siguiente_lectura
    ADD CONSTRAINT uq_siguiente_lectura_acometida UNIQUE (acometida_id);


--
-- TOC entry 9067 (class 2606 OID 189139)
-- Name: usuario_permisos usuario_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_pkey PRIMARY KEY (usuario_permiso_id);


--
-- TOC entry 9069 (class 2606 OID 189141)
-- Name: usuario_permisos usuario_permisos_usuario_id_permiso_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_usuario_id_permiso_id_key UNIQUE (usuario_id, permiso_id);


--
-- TOC entry 9073 (class 2606 OID 189143)
-- Name: usuario_roles usuario_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_pkey PRIMARY KEY (usuario_rol_id);


--
-- TOC entry 9075 (class 2606 OID 189145)
-- Name: usuario_roles usuario_roles_usuario_id_rol_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_usuario_id_rol_id_key UNIQUE (usuario_id, rol_id);


--
-- TOC entry 8221 (class 2606 OID 189147)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 8223 (class 2606 OID 189149)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 8225 (class 2606 OID 189151)
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- TOC entry 9081 (class 2606 OID 189153)
-- Name: zona zona_codigo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.zona
    ADD CONSTRAINT zona_codigo_key UNIQUE (codigo);


--
-- TOC entry 9083 (class 2606 OID 189155)
-- Name: adjuntos_orden_trabajo adjuntos_orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.adjuntos_orden_trabajo
    ADD CONSTRAINT adjuntos_orden_trabajo_pkey PRIMARY KEY (id_adjunto);


--
-- TOC entry 9086 (class 2606 OID 189157)
-- Name: asignacion_orden_trabajo_trabajador asignacion_orden_trabajo_trab_id_orden_trabajo_id_trabajado_key; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.asignacion_orden_trabajo_trabajador
    ADD CONSTRAINT asignacion_orden_trabajo_trab_id_orden_trabajo_id_trabajado_key UNIQUE (id_orden_trabajo, id_trabajador);


--
-- TOC entry 9088 (class 2606 OID 189159)
-- Name: asignacion_orden_trabajo_trabajador asignacion_orden_trabajo_trabajador_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.asignacion_orden_trabajo_trabajador
    ADD CONSTRAINT asignacion_orden_trabajo_trabajador_pkey PRIMARY KEY (id_asignacion);


--
-- TOC entry 9091 (class 2606 OID 189161)
-- Name: auditoria_inv_inventario auditoria_inv_inventario_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.auditoria_inv_inventario
    ADD CONSTRAINT auditoria_inv_inventario_pkey PRIMARY KEY (id_auditoria_inv_inventario);


--
-- TOC entry 9093 (class 2606 OID 189163)
-- Name: departamento_trabajo departamento_trabajo_nombre_key; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.departamento_trabajo
    ADD CONSTRAINT departamento_trabajo_nombre_key UNIQUE (nombre);


--
-- TOC entry 9095 (class 2606 OID 189165)
-- Name: departamento_trabajo departamento_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.departamento_trabajo
    ADD CONSTRAINT departamento_trabajo_pkey PRIMARY KEY (id_departamento);


--
-- TOC entry 9097 (class 2606 OID 189167)
-- Name: detalle_orden_trabajo_material detalle_orden_trabajo_material_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.detalle_orden_trabajo_material
    ADD CONSTRAINT detalle_orden_trabajo_material_pkey PRIMARY KEY (id_detalle_orden_trabajo_material);


--
-- TOC entry 9100 (class 2606 OID 189169)
-- Name: detalle_prioridad detalle_prioridad_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.detalle_prioridad
    ADD CONSTRAINT detalle_prioridad_pkey PRIMARY KEY (id_detalle_prioridad);


--
-- TOC entry 9104 (class 2606 OID 189171)
-- Name: detalle_tipo_trabajo detalle_tipo_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.detalle_tipo_trabajo
    ADD CONSTRAINT detalle_tipo_trabajo_pkey PRIMARY KEY (id_detalle_tipo_trabajo);


--
-- TOC entry 9108 (class 2606 OID 189173)
-- Name: estado_orden_trabajo estado_orden_trabajo_nombre_estado_key; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.estado_orden_trabajo
    ADD CONSTRAINT estado_orden_trabajo_nombre_estado_key UNIQUE (nombre_estado);


--
-- TOC entry 9110 (class 2606 OID 189175)
-- Name: estado_orden_trabajo estado_orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.estado_orden_trabajo
    ADD CONSTRAINT estado_orden_trabajo_pkey PRIMARY KEY (id_estado);


--
-- TOC entry 9113 (class 2606 OID 189177)
-- Name: historial_estado_orden_trabajo historial_estado_orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo
    ADD CONSTRAINT historial_estado_orden_trabajo_pkey PRIMARY KEY (id_historial);


--
-- TOC entry 9117 (class 2606 OID 189179)
-- Name: observaciones_orden_trabajo observaciones_orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.observaciones_orden_trabajo
    ADD CONSTRAINT observaciones_orden_trabajo_pkey PRIMARY KEY (id_observacion);


--
-- TOC entry 9126 (class 2606 OID 189181)
-- Name: orden_trabajo orden_trabajo_codigo_orden_key; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_codigo_orden_key UNIQUE (codigo_orden);


--
-- TOC entry 9128 (class 2606 OID 189183)
-- Name: orden_trabajo orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_pkey PRIMARY KEY (id_orden_trabajo);


--
-- TOC entry 9131 (class 2606 OID 189185)
-- Name: prioridad_orden_trabajo prioridad_orden_trabajo_nivel_key; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.prioridad_orden_trabajo
    ADD CONSTRAINT prioridad_orden_trabajo_nivel_key UNIQUE (nivel);


--
-- TOC entry 9133 (class 2606 OID 189187)
-- Name: prioridad_orden_trabajo prioridad_orden_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.prioridad_orden_trabajo
    ADD CONSTRAINT prioridad_orden_trabajo_pkey PRIMARY KEY (id_prioridad);


--
-- TOC entry 9136 (class 2606 OID 189189)
-- Name: rol_trabajador rol_trabajador_nombre_key; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.rol_trabajador
    ADD CONSTRAINT rol_trabajador_nombre_key UNIQUE (nombre);


--
-- TOC entry 9138 (class 2606 OID 189191)
-- Name: rol_trabajador rol_trabajador_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.rol_trabajador
    ADD CONSTRAINT rol_trabajador_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 9141 (class 2606 OID 189193)
-- Name: tipo_trabajo tipo_trabajo_nombre_key; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.tipo_trabajo
    ADD CONSTRAINT tipo_trabajo_nombre_key UNIQUE (nombre);


--
-- TOC entry 9143 (class 2606 OID 189195)
-- Name: tipo_trabajo tipo_trabajo_pkey; Type: CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.tipo_trabajo
    ADD CONSTRAINT tipo_trabajo_pkey PRIMARY KEY (id_tipo_trabajo);


--
-- TOC entry 8198 (class 1259 OID 189196)
-- Name: idx_catastro_clave; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_catastro_clave ON acometidas.registro_catastral USING btree (clave_catastral);


--
-- TOC entry 8199 (class 1259 OID 189197)
-- Name: idx_catastro_geom; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_catastro_geom ON acometidas.registro_catastral USING gist (geom);


--
-- TOC entry 8200 (class 1259 OID 189198)
-- Name: idx_catastro_medidor; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_catastro_medidor ON acometidas.registro_catastral USING btree (numero_medidor);


--
-- TOC entry 8173 (class 1259 OID 189199)
-- Name: idx_doc_estado; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_doc_estado ON acometidas.documento_adjunto USING btree (estado_validacion);


--
-- TOC entry 8174 (class 1259 OID 189200)
-- Name: idx_doc_solicitud; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_doc_solicitud ON acometidas.documento_adjunto USING btree (id_solicitud);


--
-- TOC entry 8183 (class 1259 OID 189201)
-- Name: idx_historial_fecha; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_historial_fecha ON acometidas.historial_estado USING btree (fecha_cambio DESC);


--
-- TOC entry 8184 (class 1259 OID 189202)
-- Name: idx_historial_solicitud; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_historial_solicitud ON acometidas.historial_estado USING btree (id_solicitud);


--
-- TOC entry 8193 (class 1259 OID 189203)
-- Name: idx_notif_destinatario; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_notif_destinatario ON acometidas.notificacion USING btree (id_destinatario);


--
-- TOC entry 8194 (class 1259 OID 189204)
-- Name: idx_notif_enviado; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_notif_enviado ON acometidas.notificacion USING btree (enviado) WHERE (enviado = false);


--
-- TOC entry 8195 (class 1259 OID 189205)
-- Name: idx_notif_solicitud; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_notif_solicitud ON acometidas.notificacion USING btree (id_solicitud);


--
-- TOC entry 8207 (class 1259 OID 189206)
-- Name: idx_solicitud_catastral; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_solicitud_catastral ON acometidas.solicitud USING btree (clave_catastral);


--
-- TOC entry 8208 (class 1259 OID 189207)
-- Name: idx_solicitud_cliente; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_solicitud_cliente ON acometidas.solicitud USING btree (id_cliente);


--
-- TOC entry 8209 (class 1259 OID 189208)
-- Name: idx_solicitud_datos; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_solicitud_datos ON acometidas.solicitud USING gin (datos_adicionales);


--
-- TOC entry 8210 (class 1259 OID 189209)
-- Name: idx_solicitud_estado; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_solicitud_estado ON acometidas.solicitud USING btree (estado);


--
-- TOC entry 8211 (class 1259 OID 189210)
-- Name: idx_solicitud_geom; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_solicitud_geom ON acometidas.solicitud USING gist (geom);


--
-- TOC entry 8214 (class 1259 OID 189211)
-- Name: idx_solicitud_ot_ot; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_solicitud_ot_ot ON acometidas.solicitud_orden_trabajo USING btree (id_orden_trabajo);


--
-- TOC entry 8215 (class 1259 OID 189212)
-- Name: idx_solicitud_ot_sol; Type: INDEX; Schema: acometidas; Owner: -
--

CREATE INDEX idx_solicitud_ot_sol ON acometidas.solicitud_orden_trabajo USING btree (id_solicitud);


--
-- TOC entry 8228 (class 1259 OID 189213)
-- Name: idx_alerta_no_resuelta; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_alerta_no_resuelta ON audit.alerta USING btree (resuelta, created_at DESC) WHERE (resuelta = false);


--
-- TOC entry 8229 (class 1259 OID 189214)
-- Name: idx_alerta_severidad_ts; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_alerta_severidad_ts ON audit.alerta USING btree (severidad, created_at DESC);


--
-- TOC entry 8230 (class 1259 OID 189215)
-- Name: idx_alerta_tipo; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_alerta_tipo ON audit.alerta USING btree (tipo_alerta, created_at DESC);


--
-- TOC entry 8231 (class 1259 OID 189216)
-- Name: idx_alerta_usuario; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_alerta_usuario ON audit.alerta USING btree (usuario_id, created_at DESC);


--
-- TOC entry 8232 (class 1259 OID 189217)
-- Name: idx_audit_reg_diff_gin; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_reg_diff_gin ON ONLY audit.registro USING gin (diff_jsonb);


--
-- TOC entry 8233 (class 1259 OID 189218)
-- Name: idx_audit_reg_operacion; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_reg_operacion ON ONLY audit.registro USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8234 (class 1259 OID 189219)
-- Name: idx_audit_reg_pk_gin; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_reg_pk_gin ON ONLY audit.registro USING gin (pk_valor);


--
-- TOC entry 8235 (class 1259 OID 189220)
-- Name: idx_audit_reg_sesion; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_reg_sesion ON ONLY audit.registro USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8236 (class 1259 OID 189221)
-- Name: idx_audit_reg_tabla_ts; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_reg_tabla_ts ON ONLY audit.registro USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8237 (class 1259 OID 189222)
-- Name: idx_audit_reg_ts_desc; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_reg_ts_desc ON ONLY audit.registro USING btree (audit_timestamp DESC);


--
-- TOC entry 8238 (class 1259 OID 189223)
-- Name: idx_audit_reg_usuario_ts; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_reg_usuario_ts ON ONLY audit.registro USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8686 (class 1259 OID 189224)
-- Name: idx_audit_sesion_evento; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_sesion_evento ON ONLY audit.sesion USING btree (evento, audit_timestamp DESC);


--
-- TOC entry 8687 (class 1259 OID 189225)
-- Name: idx_audit_sesion_ip; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_sesion_ip ON ONLY audit.sesion USING btree (ip_address, audit_timestamp DESC);


--
-- TOC entry 8688 (class 1259 OID 189226)
-- Name: idx_audit_sesion_usuario_ts; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_audit_sesion_usuario_ts ON ONLY audit.sesion USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8718 (class 1259 OID 189227)
-- Name: idx_refresh_token_expiration; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_refresh_token_expiration ON audit.usuario_refresh_tokens USING btree (expires_at) WHERE (revoked = false);


--
-- TOC entry 8719 (class 1259 OID 189228)
-- Name: idx_refresh_token_hash; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_refresh_token_hash ON audit.usuario_refresh_tokens USING btree (token_hash) WHERE (revoked = false);


--
-- TOC entry 8720 (class 1259 OID 189229)
-- Name: idx_refresh_token_usuario; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX idx_refresh_token_usuario ON audit.usuario_refresh_tokens USING btree (usuario_id);


--
-- TOC entry 8241 (class 1259 OID 189230)
-- Name: registro_2024_01_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_01_audit_timestamp_idx ON audit.registro_2024_01 USING btree (audit_timestamp DESC);


--
-- TOC entry 8242 (class 1259 OID 189231)
-- Name: registro_2024_01_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_01_diff_jsonb_idx ON audit.registro_2024_01 USING gin (diff_jsonb);


--
-- TOC entry 8243 (class 1259 OID 189232)
-- Name: registro_2024_01_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_01_operacion_audit_timestamp_idx ON audit.registro_2024_01 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8244 (class 1259 OID 189233)
-- Name: registro_2024_01_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_01_pk_valor_idx ON audit.registro_2024_01 USING gin (pk_valor);


--
-- TOC entry 8247 (class 1259 OID 189234)
-- Name: registro_2024_01_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_01_sesion_id_idx ON audit.registro_2024_01 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8248 (class 1259 OID 189235)
-- Name: registro_2024_01_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_01_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_01 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8249 (class 1259 OID 189236)
-- Name: registro_2024_01_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_01_usuario_id_audit_timestamp_idx ON audit.registro_2024_01 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8250 (class 1259 OID 189237)
-- Name: registro_2024_02_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_02_audit_timestamp_idx ON audit.registro_2024_02 USING btree (audit_timestamp DESC);


--
-- TOC entry 8251 (class 1259 OID 189238)
-- Name: registro_2024_02_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_02_diff_jsonb_idx ON audit.registro_2024_02 USING gin (diff_jsonb);


--
-- TOC entry 8252 (class 1259 OID 189239)
-- Name: registro_2024_02_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_02_operacion_audit_timestamp_idx ON audit.registro_2024_02 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8253 (class 1259 OID 189240)
-- Name: registro_2024_02_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_02_pk_valor_idx ON audit.registro_2024_02 USING gin (pk_valor);


--
-- TOC entry 8256 (class 1259 OID 189241)
-- Name: registro_2024_02_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_02_sesion_id_idx ON audit.registro_2024_02 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8257 (class 1259 OID 189242)
-- Name: registro_2024_02_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_02_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_02 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8258 (class 1259 OID 189243)
-- Name: registro_2024_02_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_02_usuario_id_audit_timestamp_idx ON audit.registro_2024_02 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8259 (class 1259 OID 189244)
-- Name: registro_2024_03_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_03_audit_timestamp_idx ON audit.registro_2024_03 USING btree (audit_timestamp DESC);


--
-- TOC entry 8260 (class 1259 OID 189245)
-- Name: registro_2024_03_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_03_diff_jsonb_idx ON audit.registro_2024_03 USING gin (diff_jsonb);


--
-- TOC entry 8261 (class 1259 OID 189246)
-- Name: registro_2024_03_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_03_operacion_audit_timestamp_idx ON audit.registro_2024_03 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8262 (class 1259 OID 189247)
-- Name: registro_2024_03_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_03_pk_valor_idx ON audit.registro_2024_03 USING gin (pk_valor);


--
-- TOC entry 8265 (class 1259 OID 189248)
-- Name: registro_2024_03_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_03_sesion_id_idx ON audit.registro_2024_03 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8266 (class 1259 OID 189249)
-- Name: registro_2024_03_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_03_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_03 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8267 (class 1259 OID 189250)
-- Name: registro_2024_03_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_03_usuario_id_audit_timestamp_idx ON audit.registro_2024_03 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8268 (class 1259 OID 189251)
-- Name: registro_2024_04_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_04_audit_timestamp_idx ON audit.registro_2024_04 USING btree (audit_timestamp DESC);


--
-- TOC entry 8269 (class 1259 OID 189252)
-- Name: registro_2024_04_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_04_diff_jsonb_idx ON audit.registro_2024_04 USING gin (diff_jsonb);


--
-- TOC entry 8270 (class 1259 OID 189253)
-- Name: registro_2024_04_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_04_operacion_audit_timestamp_idx ON audit.registro_2024_04 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8271 (class 1259 OID 189254)
-- Name: registro_2024_04_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_04_pk_valor_idx ON audit.registro_2024_04 USING gin (pk_valor);


--
-- TOC entry 8274 (class 1259 OID 189255)
-- Name: registro_2024_04_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_04_sesion_id_idx ON audit.registro_2024_04 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8275 (class 1259 OID 189256)
-- Name: registro_2024_04_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_04_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_04 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8276 (class 1259 OID 189257)
-- Name: registro_2024_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_04_usuario_id_audit_timestamp_idx ON audit.registro_2024_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8277 (class 1259 OID 189258)
-- Name: registro_2024_05_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_05_audit_timestamp_idx ON audit.registro_2024_05 USING btree (audit_timestamp DESC);


--
-- TOC entry 8278 (class 1259 OID 189259)
-- Name: registro_2024_05_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_05_diff_jsonb_idx ON audit.registro_2024_05 USING gin (diff_jsonb);


--
-- TOC entry 8279 (class 1259 OID 189260)
-- Name: registro_2024_05_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_05_operacion_audit_timestamp_idx ON audit.registro_2024_05 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8280 (class 1259 OID 189261)
-- Name: registro_2024_05_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_05_pk_valor_idx ON audit.registro_2024_05 USING gin (pk_valor);


--
-- TOC entry 8283 (class 1259 OID 189262)
-- Name: registro_2024_05_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_05_sesion_id_idx ON audit.registro_2024_05 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8284 (class 1259 OID 189263)
-- Name: registro_2024_05_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_05_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_05 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8285 (class 1259 OID 189264)
-- Name: registro_2024_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_05_usuario_id_audit_timestamp_idx ON audit.registro_2024_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8286 (class 1259 OID 189265)
-- Name: registro_2024_06_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_06_audit_timestamp_idx ON audit.registro_2024_06 USING btree (audit_timestamp DESC);


--
-- TOC entry 8287 (class 1259 OID 189266)
-- Name: registro_2024_06_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_06_diff_jsonb_idx ON audit.registro_2024_06 USING gin (diff_jsonb);


--
-- TOC entry 8288 (class 1259 OID 189267)
-- Name: registro_2024_06_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_06_operacion_audit_timestamp_idx ON audit.registro_2024_06 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8289 (class 1259 OID 189268)
-- Name: registro_2024_06_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_06_pk_valor_idx ON audit.registro_2024_06 USING gin (pk_valor);


--
-- TOC entry 8292 (class 1259 OID 189269)
-- Name: registro_2024_06_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_06_sesion_id_idx ON audit.registro_2024_06 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8293 (class 1259 OID 189270)
-- Name: registro_2024_06_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_06_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_06 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8294 (class 1259 OID 189271)
-- Name: registro_2024_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_06_usuario_id_audit_timestamp_idx ON audit.registro_2024_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8295 (class 1259 OID 189272)
-- Name: registro_2024_07_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_07_audit_timestamp_idx ON audit.registro_2024_07 USING btree (audit_timestamp DESC);


--
-- TOC entry 8296 (class 1259 OID 189273)
-- Name: registro_2024_07_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_07_diff_jsonb_idx ON audit.registro_2024_07 USING gin (diff_jsonb);


--
-- TOC entry 8297 (class 1259 OID 189274)
-- Name: registro_2024_07_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_07_operacion_audit_timestamp_idx ON audit.registro_2024_07 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8298 (class 1259 OID 189275)
-- Name: registro_2024_07_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_07_pk_valor_idx ON audit.registro_2024_07 USING gin (pk_valor);


--
-- TOC entry 8301 (class 1259 OID 189276)
-- Name: registro_2024_07_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_07_sesion_id_idx ON audit.registro_2024_07 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8302 (class 1259 OID 189277)
-- Name: registro_2024_07_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_07_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_07 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8303 (class 1259 OID 189278)
-- Name: registro_2024_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_07_usuario_id_audit_timestamp_idx ON audit.registro_2024_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8304 (class 1259 OID 189279)
-- Name: registro_2024_08_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_08_audit_timestamp_idx ON audit.registro_2024_08 USING btree (audit_timestamp DESC);


--
-- TOC entry 8305 (class 1259 OID 189280)
-- Name: registro_2024_08_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_08_diff_jsonb_idx ON audit.registro_2024_08 USING gin (diff_jsonb);


--
-- TOC entry 8306 (class 1259 OID 189281)
-- Name: registro_2024_08_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_08_operacion_audit_timestamp_idx ON audit.registro_2024_08 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8307 (class 1259 OID 189282)
-- Name: registro_2024_08_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_08_pk_valor_idx ON audit.registro_2024_08 USING gin (pk_valor);


--
-- TOC entry 8310 (class 1259 OID 189283)
-- Name: registro_2024_08_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_08_sesion_id_idx ON audit.registro_2024_08 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8311 (class 1259 OID 189284)
-- Name: registro_2024_08_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_08_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_08 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8312 (class 1259 OID 189285)
-- Name: registro_2024_08_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_08_usuario_id_audit_timestamp_idx ON audit.registro_2024_08 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8313 (class 1259 OID 189286)
-- Name: registro_2024_09_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_09_audit_timestamp_idx ON audit.registro_2024_09 USING btree (audit_timestamp DESC);


--
-- TOC entry 8314 (class 1259 OID 189287)
-- Name: registro_2024_09_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_09_diff_jsonb_idx ON audit.registro_2024_09 USING gin (diff_jsonb);


--
-- TOC entry 8315 (class 1259 OID 189288)
-- Name: registro_2024_09_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_09_operacion_audit_timestamp_idx ON audit.registro_2024_09 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8316 (class 1259 OID 189289)
-- Name: registro_2024_09_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_09_pk_valor_idx ON audit.registro_2024_09 USING gin (pk_valor);


--
-- TOC entry 8319 (class 1259 OID 189290)
-- Name: registro_2024_09_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_09_sesion_id_idx ON audit.registro_2024_09 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8320 (class 1259 OID 189291)
-- Name: registro_2024_09_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_09_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_09 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8321 (class 1259 OID 189292)
-- Name: registro_2024_09_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_09_usuario_id_audit_timestamp_idx ON audit.registro_2024_09 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8322 (class 1259 OID 189293)
-- Name: registro_2024_10_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_10_audit_timestamp_idx ON audit.registro_2024_10 USING btree (audit_timestamp DESC);


--
-- TOC entry 8323 (class 1259 OID 189294)
-- Name: registro_2024_10_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_10_diff_jsonb_idx ON audit.registro_2024_10 USING gin (diff_jsonb);


--
-- TOC entry 8324 (class 1259 OID 189295)
-- Name: registro_2024_10_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_10_operacion_audit_timestamp_idx ON audit.registro_2024_10 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8325 (class 1259 OID 189296)
-- Name: registro_2024_10_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_10_pk_valor_idx ON audit.registro_2024_10 USING gin (pk_valor);


--
-- TOC entry 8328 (class 1259 OID 189297)
-- Name: registro_2024_10_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_10_sesion_id_idx ON audit.registro_2024_10 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8329 (class 1259 OID 189298)
-- Name: registro_2024_10_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_10_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_10 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8330 (class 1259 OID 189299)
-- Name: registro_2024_10_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_10_usuario_id_audit_timestamp_idx ON audit.registro_2024_10 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8331 (class 1259 OID 189300)
-- Name: registro_2024_11_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_11_audit_timestamp_idx ON audit.registro_2024_11 USING btree (audit_timestamp DESC);


--
-- TOC entry 8332 (class 1259 OID 189301)
-- Name: registro_2024_11_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_11_diff_jsonb_idx ON audit.registro_2024_11 USING gin (diff_jsonb);


--
-- TOC entry 8333 (class 1259 OID 189302)
-- Name: registro_2024_11_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_11_operacion_audit_timestamp_idx ON audit.registro_2024_11 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8334 (class 1259 OID 189303)
-- Name: registro_2024_11_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_11_pk_valor_idx ON audit.registro_2024_11 USING gin (pk_valor);


--
-- TOC entry 8337 (class 1259 OID 189304)
-- Name: registro_2024_11_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_11_sesion_id_idx ON audit.registro_2024_11 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8338 (class 1259 OID 189305)
-- Name: registro_2024_11_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_11_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_11 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8339 (class 1259 OID 189306)
-- Name: registro_2024_11_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_11_usuario_id_audit_timestamp_idx ON audit.registro_2024_11 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8340 (class 1259 OID 189307)
-- Name: registro_2024_12_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_12_audit_timestamp_idx ON audit.registro_2024_12 USING btree (audit_timestamp DESC);


--
-- TOC entry 8341 (class 1259 OID 189308)
-- Name: registro_2024_12_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_12_diff_jsonb_idx ON audit.registro_2024_12 USING gin (diff_jsonb);


--
-- TOC entry 8342 (class 1259 OID 189309)
-- Name: registro_2024_12_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_12_operacion_audit_timestamp_idx ON audit.registro_2024_12 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8343 (class 1259 OID 189310)
-- Name: registro_2024_12_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_12_pk_valor_idx ON audit.registro_2024_12 USING gin (pk_valor);


--
-- TOC entry 8346 (class 1259 OID 189311)
-- Name: registro_2024_12_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_12_sesion_id_idx ON audit.registro_2024_12 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8347 (class 1259 OID 189312)
-- Name: registro_2024_12_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_12_tabla_nombre_audit_timestamp_idx ON audit.registro_2024_12 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8348 (class 1259 OID 189313)
-- Name: registro_2024_12_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2024_12_usuario_id_audit_timestamp_idx ON audit.registro_2024_12 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8349 (class 1259 OID 189314)
-- Name: registro_2025_01_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_01_audit_timestamp_idx ON audit.registro_2025_01 USING btree (audit_timestamp DESC);


--
-- TOC entry 8350 (class 1259 OID 189315)
-- Name: registro_2025_01_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_01_diff_jsonb_idx ON audit.registro_2025_01 USING gin (diff_jsonb);


--
-- TOC entry 8351 (class 1259 OID 189316)
-- Name: registro_2025_01_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_01_operacion_audit_timestamp_idx ON audit.registro_2025_01 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8352 (class 1259 OID 189317)
-- Name: registro_2025_01_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_01_pk_valor_idx ON audit.registro_2025_01 USING gin (pk_valor);


--
-- TOC entry 8355 (class 1259 OID 189318)
-- Name: registro_2025_01_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_01_sesion_id_idx ON audit.registro_2025_01 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8356 (class 1259 OID 189319)
-- Name: registro_2025_01_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_01_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_01 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8357 (class 1259 OID 189320)
-- Name: registro_2025_01_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_01_usuario_id_audit_timestamp_idx ON audit.registro_2025_01 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8358 (class 1259 OID 189321)
-- Name: registro_2025_02_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_02_audit_timestamp_idx ON audit.registro_2025_02 USING btree (audit_timestamp DESC);


--
-- TOC entry 8359 (class 1259 OID 189322)
-- Name: registro_2025_02_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_02_diff_jsonb_idx ON audit.registro_2025_02 USING gin (diff_jsonb);


--
-- TOC entry 8360 (class 1259 OID 189323)
-- Name: registro_2025_02_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_02_operacion_audit_timestamp_idx ON audit.registro_2025_02 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8361 (class 1259 OID 189324)
-- Name: registro_2025_02_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_02_pk_valor_idx ON audit.registro_2025_02 USING gin (pk_valor);


--
-- TOC entry 8364 (class 1259 OID 189325)
-- Name: registro_2025_02_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_02_sesion_id_idx ON audit.registro_2025_02 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8365 (class 1259 OID 189326)
-- Name: registro_2025_02_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_02_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_02 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8366 (class 1259 OID 189327)
-- Name: registro_2025_02_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_02_usuario_id_audit_timestamp_idx ON audit.registro_2025_02 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8367 (class 1259 OID 189328)
-- Name: registro_2025_03_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_03_audit_timestamp_idx ON audit.registro_2025_03 USING btree (audit_timestamp DESC);


--
-- TOC entry 8368 (class 1259 OID 189329)
-- Name: registro_2025_03_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_03_diff_jsonb_idx ON audit.registro_2025_03 USING gin (diff_jsonb);


--
-- TOC entry 8369 (class 1259 OID 189330)
-- Name: registro_2025_03_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_03_operacion_audit_timestamp_idx ON audit.registro_2025_03 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8370 (class 1259 OID 189331)
-- Name: registro_2025_03_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_03_pk_valor_idx ON audit.registro_2025_03 USING gin (pk_valor);


--
-- TOC entry 8373 (class 1259 OID 189332)
-- Name: registro_2025_03_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_03_sesion_id_idx ON audit.registro_2025_03 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8374 (class 1259 OID 189333)
-- Name: registro_2025_03_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_03_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_03 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8375 (class 1259 OID 189334)
-- Name: registro_2025_03_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_03_usuario_id_audit_timestamp_idx ON audit.registro_2025_03 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8376 (class 1259 OID 189335)
-- Name: registro_2025_04_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_04_audit_timestamp_idx ON audit.registro_2025_04 USING btree (audit_timestamp DESC);


--
-- TOC entry 8377 (class 1259 OID 189336)
-- Name: registro_2025_04_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_04_diff_jsonb_idx ON audit.registro_2025_04 USING gin (diff_jsonb);


--
-- TOC entry 8378 (class 1259 OID 189337)
-- Name: registro_2025_04_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_04_operacion_audit_timestamp_idx ON audit.registro_2025_04 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8379 (class 1259 OID 189338)
-- Name: registro_2025_04_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_04_pk_valor_idx ON audit.registro_2025_04 USING gin (pk_valor);


--
-- TOC entry 8382 (class 1259 OID 189339)
-- Name: registro_2025_04_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_04_sesion_id_idx ON audit.registro_2025_04 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8383 (class 1259 OID 189340)
-- Name: registro_2025_04_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_04_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_04 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8384 (class 1259 OID 189341)
-- Name: registro_2025_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_04_usuario_id_audit_timestamp_idx ON audit.registro_2025_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8385 (class 1259 OID 189342)
-- Name: registro_2025_05_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_05_audit_timestamp_idx ON audit.registro_2025_05 USING btree (audit_timestamp DESC);


--
-- TOC entry 8386 (class 1259 OID 189343)
-- Name: registro_2025_05_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_05_diff_jsonb_idx ON audit.registro_2025_05 USING gin (diff_jsonb);


--
-- TOC entry 8387 (class 1259 OID 189344)
-- Name: registro_2025_05_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_05_operacion_audit_timestamp_idx ON audit.registro_2025_05 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8388 (class 1259 OID 189345)
-- Name: registro_2025_05_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_05_pk_valor_idx ON audit.registro_2025_05 USING gin (pk_valor);


--
-- TOC entry 8391 (class 1259 OID 189346)
-- Name: registro_2025_05_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_05_sesion_id_idx ON audit.registro_2025_05 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8392 (class 1259 OID 189347)
-- Name: registro_2025_05_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_05_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_05 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8393 (class 1259 OID 189348)
-- Name: registro_2025_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_05_usuario_id_audit_timestamp_idx ON audit.registro_2025_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8394 (class 1259 OID 189349)
-- Name: registro_2025_06_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_06_audit_timestamp_idx ON audit.registro_2025_06 USING btree (audit_timestamp DESC);


--
-- TOC entry 8395 (class 1259 OID 189350)
-- Name: registro_2025_06_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_06_diff_jsonb_idx ON audit.registro_2025_06 USING gin (diff_jsonb);


--
-- TOC entry 8396 (class 1259 OID 189351)
-- Name: registro_2025_06_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_06_operacion_audit_timestamp_idx ON audit.registro_2025_06 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8397 (class 1259 OID 189352)
-- Name: registro_2025_06_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_06_pk_valor_idx ON audit.registro_2025_06 USING gin (pk_valor);


--
-- TOC entry 8400 (class 1259 OID 189353)
-- Name: registro_2025_06_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_06_sesion_id_idx ON audit.registro_2025_06 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8401 (class 1259 OID 189354)
-- Name: registro_2025_06_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_06_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_06 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8402 (class 1259 OID 189355)
-- Name: registro_2025_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_06_usuario_id_audit_timestamp_idx ON audit.registro_2025_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8403 (class 1259 OID 189356)
-- Name: registro_2025_07_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_07_audit_timestamp_idx ON audit.registro_2025_07 USING btree (audit_timestamp DESC);


--
-- TOC entry 8404 (class 1259 OID 189357)
-- Name: registro_2025_07_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_07_diff_jsonb_idx ON audit.registro_2025_07 USING gin (diff_jsonb);


--
-- TOC entry 8405 (class 1259 OID 189358)
-- Name: registro_2025_07_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_07_operacion_audit_timestamp_idx ON audit.registro_2025_07 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8406 (class 1259 OID 189359)
-- Name: registro_2025_07_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_07_pk_valor_idx ON audit.registro_2025_07 USING gin (pk_valor);


--
-- TOC entry 8409 (class 1259 OID 189360)
-- Name: registro_2025_07_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_07_sesion_id_idx ON audit.registro_2025_07 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8410 (class 1259 OID 189361)
-- Name: registro_2025_07_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_07_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_07 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8411 (class 1259 OID 189362)
-- Name: registro_2025_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_07_usuario_id_audit_timestamp_idx ON audit.registro_2025_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8412 (class 1259 OID 189363)
-- Name: registro_2025_08_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_08_audit_timestamp_idx ON audit.registro_2025_08 USING btree (audit_timestamp DESC);


--
-- TOC entry 8413 (class 1259 OID 189364)
-- Name: registro_2025_08_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_08_diff_jsonb_idx ON audit.registro_2025_08 USING gin (diff_jsonb);


--
-- TOC entry 8414 (class 1259 OID 189365)
-- Name: registro_2025_08_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_08_operacion_audit_timestamp_idx ON audit.registro_2025_08 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8415 (class 1259 OID 189366)
-- Name: registro_2025_08_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_08_pk_valor_idx ON audit.registro_2025_08 USING gin (pk_valor);


--
-- TOC entry 8418 (class 1259 OID 189367)
-- Name: registro_2025_08_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_08_sesion_id_idx ON audit.registro_2025_08 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8419 (class 1259 OID 189368)
-- Name: registro_2025_08_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_08_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_08 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8420 (class 1259 OID 189369)
-- Name: registro_2025_08_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_08_usuario_id_audit_timestamp_idx ON audit.registro_2025_08 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8421 (class 1259 OID 189370)
-- Name: registro_2025_09_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_09_audit_timestamp_idx ON audit.registro_2025_09 USING btree (audit_timestamp DESC);


--
-- TOC entry 8422 (class 1259 OID 189371)
-- Name: registro_2025_09_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_09_diff_jsonb_idx ON audit.registro_2025_09 USING gin (diff_jsonb);


--
-- TOC entry 8423 (class 1259 OID 189372)
-- Name: registro_2025_09_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_09_operacion_audit_timestamp_idx ON audit.registro_2025_09 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8424 (class 1259 OID 189373)
-- Name: registro_2025_09_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_09_pk_valor_idx ON audit.registro_2025_09 USING gin (pk_valor);


--
-- TOC entry 8427 (class 1259 OID 189374)
-- Name: registro_2025_09_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_09_sesion_id_idx ON audit.registro_2025_09 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8428 (class 1259 OID 189375)
-- Name: registro_2025_09_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_09_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_09 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8429 (class 1259 OID 189376)
-- Name: registro_2025_09_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_09_usuario_id_audit_timestamp_idx ON audit.registro_2025_09 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8430 (class 1259 OID 189377)
-- Name: registro_2025_10_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_10_audit_timestamp_idx ON audit.registro_2025_10 USING btree (audit_timestamp DESC);


--
-- TOC entry 8431 (class 1259 OID 189378)
-- Name: registro_2025_10_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_10_diff_jsonb_idx ON audit.registro_2025_10 USING gin (diff_jsonb);


--
-- TOC entry 8432 (class 1259 OID 189379)
-- Name: registro_2025_10_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_10_operacion_audit_timestamp_idx ON audit.registro_2025_10 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8433 (class 1259 OID 189380)
-- Name: registro_2025_10_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_10_pk_valor_idx ON audit.registro_2025_10 USING gin (pk_valor);


--
-- TOC entry 8436 (class 1259 OID 189381)
-- Name: registro_2025_10_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_10_sesion_id_idx ON audit.registro_2025_10 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8437 (class 1259 OID 189382)
-- Name: registro_2025_10_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_10_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_10 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8438 (class 1259 OID 189383)
-- Name: registro_2025_10_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_10_usuario_id_audit_timestamp_idx ON audit.registro_2025_10 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8439 (class 1259 OID 189384)
-- Name: registro_2025_11_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_11_audit_timestamp_idx ON audit.registro_2025_11 USING btree (audit_timestamp DESC);


--
-- TOC entry 8440 (class 1259 OID 189385)
-- Name: registro_2025_11_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_11_diff_jsonb_idx ON audit.registro_2025_11 USING gin (diff_jsonb);


--
-- TOC entry 8441 (class 1259 OID 189386)
-- Name: registro_2025_11_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_11_operacion_audit_timestamp_idx ON audit.registro_2025_11 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8442 (class 1259 OID 189387)
-- Name: registro_2025_11_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_11_pk_valor_idx ON audit.registro_2025_11 USING gin (pk_valor);


--
-- TOC entry 8445 (class 1259 OID 189388)
-- Name: registro_2025_11_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_11_sesion_id_idx ON audit.registro_2025_11 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8446 (class 1259 OID 189389)
-- Name: registro_2025_11_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_11_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_11 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8447 (class 1259 OID 189390)
-- Name: registro_2025_11_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_11_usuario_id_audit_timestamp_idx ON audit.registro_2025_11 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8448 (class 1259 OID 189391)
-- Name: registro_2025_12_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_12_audit_timestamp_idx ON audit.registro_2025_12 USING btree (audit_timestamp DESC);


--
-- TOC entry 8449 (class 1259 OID 189392)
-- Name: registro_2025_12_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_12_diff_jsonb_idx ON audit.registro_2025_12 USING gin (diff_jsonb);


--
-- TOC entry 8450 (class 1259 OID 189393)
-- Name: registro_2025_12_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_12_operacion_audit_timestamp_idx ON audit.registro_2025_12 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8451 (class 1259 OID 189394)
-- Name: registro_2025_12_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_12_pk_valor_idx ON audit.registro_2025_12 USING gin (pk_valor);


--
-- TOC entry 8454 (class 1259 OID 189395)
-- Name: registro_2025_12_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_12_sesion_id_idx ON audit.registro_2025_12 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8455 (class 1259 OID 189396)
-- Name: registro_2025_12_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_12_tabla_nombre_audit_timestamp_idx ON audit.registro_2025_12 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8456 (class 1259 OID 189397)
-- Name: registro_2025_12_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2025_12_usuario_id_audit_timestamp_idx ON audit.registro_2025_12 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8457 (class 1259 OID 189398)
-- Name: registro_2026_01_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_01_audit_timestamp_idx ON audit.registro_2026_01 USING btree (audit_timestamp DESC);


--
-- TOC entry 8458 (class 1259 OID 189399)
-- Name: registro_2026_01_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_01_diff_jsonb_idx ON audit.registro_2026_01 USING gin (diff_jsonb);


--
-- TOC entry 8459 (class 1259 OID 189400)
-- Name: registro_2026_01_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_01_operacion_audit_timestamp_idx ON audit.registro_2026_01 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8460 (class 1259 OID 189401)
-- Name: registro_2026_01_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_01_pk_valor_idx ON audit.registro_2026_01 USING gin (pk_valor);


--
-- TOC entry 8463 (class 1259 OID 189402)
-- Name: registro_2026_01_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_01_sesion_id_idx ON audit.registro_2026_01 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8464 (class 1259 OID 189403)
-- Name: registro_2026_01_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_01_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_01 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8465 (class 1259 OID 189404)
-- Name: registro_2026_01_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_01_usuario_id_audit_timestamp_idx ON audit.registro_2026_01 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8466 (class 1259 OID 189405)
-- Name: registro_2026_02_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_02_audit_timestamp_idx ON audit.registro_2026_02 USING btree (audit_timestamp DESC);


--
-- TOC entry 8467 (class 1259 OID 189406)
-- Name: registro_2026_02_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_02_diff_jsonb_idx ON audit.registro_2026_02 USING gin (diff_jsonb);


--
-- TOC entry 8468 (class 1259 OID 189407)
-- Name: registro_2026_02_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_02_operacion_audit_timestamp_idx ON audit.registro_2026_02 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8469 (class 1259 OID 189408)
-- Name: registro_2026_02_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_02_pk_valor_idx ON audit.registro_2026_02 USING gin (pk_valor);


--
-- TOC entry 8472 (class 1259 OID 189409)
-- Name: registro_2026_02_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_02_sesion_id_idx ON audit.registro_2026_02 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8473 (class 1259 OID 189410)
-- Name: registro_2026_02_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_02_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_02 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8474 (class 1259 OID 189411)
-- Name: registro_2026_02_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_02_usuario_id_audit_timestamp_idx ON audit.registro_2026_02 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8475 (class 1259 OID 189412)
-- Name: registro_2026_03_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_03_audit_timestamp_idx ON audit.registro_2026_03 USING btree (audit_timestamp DESC);


--
-- TOC entry 8476 (class 1259 OID 189413)
-- Name: registro_2026_03_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_03_diff_jsonb_idx ON audit.registro_2026_03 USING gin (diff_jsonb);


--
-- TOC entry 8477 (class 1259 OID 189414)
-- Name: registro_2026_03_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_03_operacion_audit_timestamp_idx ON audit.registro_2026_03 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8478 (class 1259 OID 189415)
-- Name: registro_2026_03_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_03_pk_valor_idx ON audit.registro_2026_03 USING gin (pk_valor);


--
-- TOC entry 8481 (class 1259 OID 189416)
-- Name: registro_2026_03_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_03_sesion_id_idx ON audit.registro_2026_03 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8482 (class 1259 OID 189417)
-- Name: registro_2026_03_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_03_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_03 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8483 (class 1259 OID 189418)
-- Name: registro_2026_03_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_03_usuario_id_audit_timestamp_idx ON audit.registro_2026_03 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8484 (class 1259 OID 189419)
-- Name: registro_2026_04_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_04_audit_timestamp_idx ON audit.registro_2026_04 USING btree (audit_timestamp DESC);


--
-- TOC entry 8485 (class 1259 OID 189420)
-- Name: registro_2026_04_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_04_diff_jsonb_idx ON audit.registro_2026_04 USING gin (diff_jsonb);


--
-- TOC entry 8486 (class 1259 OID 189421)
-- Name: registro_2026_04_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_04_operacion_audit_timestamp_idx ON audit.registro_2026_04 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8487 (class 1259 OID 189422)
-- Name: registro_2026_04_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_04_pk_valor_idx ON audit.registro_2026_04 USING gin (pk_valor);


--
-- TOC entry 8490 (class 1259 OID 189423)
-- Name: registro_2026_04_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_04_sesion_id_idx ON audit.registro_2026_04 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8491 (class 1259 OID 189424)
-- Name: registro_2026_04_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_04_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_04 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8492 (class 1259 OID 189425)
-- Name: registro_2026_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_04_usuario_id_audit_timestamp_idx ON audit.registro_2026_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8493 (class 1259 OID 189426)
-- Name: registro_2026_05_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_05_audit_timestamp_idx ON audit.registro_2026_05 USING btree (audit_timestamp DESC);


--
-- TOC entry 8494 (class 1259 OID 189427)
-- Name: registro_2026_05_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_05_diff_jsonb_idx ON audit.registro_2026_05 USING gin (diff_jsonb);


--
-- TOC entry 8495 (class 1259 OID 189428)
-- Name: registro_2026_05_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_05_operacion_audit_timestamp_idx ON audit.registro_2026_05 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8496 (class 1259 OID 189429)
-- Name: registro_2026_05_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_05_pk_valor_idx ON audit.registro_2026_05 USING gin (pk_valor);


--
-- TOC entry 8499 (class 1259 OID 189430)
-- Name: registro_2026_05_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_05_sesion_id_idx ON audit.registro_2026_05 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8500 (class 1259 OID 189431)
-- Name: registro_2026_05_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_05_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_05 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8501 (class 1259 OID 189432)
-- Name: registro_2026_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_05_usuario_id_audit_timestamp_idx ON audit.registro_2026_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8502 (class 1259 OID 189433)
-- Name: registro_2026_06_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_06_audit_timestamp_idx ON audit.registro_2026_06 USING btree (audit_timestamp DESC);


--
-- TOC entry 8503 (class 1259 OID 189434)
-- Name: registro_2026_06_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_06_diff_jsonb_idx ON audit.registro_2026_06 USING gin (diff_jsonb);


--
-- TOC entry 8504 (class 1259 OID 189435)
-- Name: registro_2026_06_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_06_operacion_audit_timestamp_idx ON audit.registro_2026_06 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8505 (class 1259 OID 189436)
-- Name: registro_2026_06_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_06_pk_valor_idx ON audit.registro_2026_06 USING gin (pk_valor);


--
-- TOC entry 8508 (class 1259 OID 189437)
-- Name: registro_2026_06_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_06_sesion_id_idx ON audit.registro_2026_06 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8509 (class 1259 OID 189438)
-- Name: registro_2026_06_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_06_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_06 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8510 (class 1259 OID 189439)
-- Name: registro_2026_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_06_usuario_id_audit_timestamp_idx ON audit.registro_2026_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8511 (class 1259 OID 189440)
-- Name: registro_2026_07_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_07_audit_timestamp_idx ON audit.registro_2026_07 USING btree (audit_timestamp DESC);


--
-- TOC entry 8512 (class 1259 OID 189441)
-- Name: registro_2026_07_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_07_diff_jsonb_idx ON audit.registro_2026_07 USING gin (diff_jsonb);


--
-- TOC entry 8513 (class 1259 OID 189442)
-- Name: registro_2026_07_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_07_operacion_audit_timestamp_idx ON audit.registro_2026_07 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8514 (class 1259 OID 189443)
-- Name: registro_2026_07_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_07_pk_valor_idx ON audit.registro_2026_07 USING gin (pk_valor);


--
-- TOC entry 8517 (class 1259 OID 189444)
-- Name: registro_2026_07_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_07_sesion_id_idx ON audit.registro_2026_07 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8518 (class 1259 OID 189445)
-- Name: registro_2026_07_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_07_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_07 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8519 (class 1259 OID 189446)
-- Name: registro_2026_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_07_usuario_id_audit_timestamp_idx ON audit.registro_2026_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8520 (class 1259 OID 189447)
-- Name: registro_2026_08_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_08_audit_timestamp_idx ON audit.registro_2026_08 USING btree (audit_timestamp DESC);


--
-- TOC entry 8521 (class 1259 OID 189448)
-- Name: registro_2026_08_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_08_diff_jsonb_idx ON audit.registro_2026_08 USING gin (diff_jsonb);


--
-- TOC entry 8522 (class 1259 OID 189449)
-- Name: registro_2026_08_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_08_operacion_audit_timestamp_idx ON audit.registro_2026_08 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8523 (class 1259 OID 189450)
-- Name: registro_2026_08_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_08_pk_valor_idx ON audit.registro_2026_08 USING gin (pk_valor);


--
-- TOC entry 8526 (class 1259 OID 189451)
-- Name: registro_2026_08_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_08_sesion_id_idx ON audit.registro_2026_08 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8527 (class 1259 OID 189452)
-- Name: registro_2026_08_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_08_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_08 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8528 (class 1259 OID 189453)
-- Name: registro_2026_08_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_08_usuario_id_audit_timestamp_idx ON audit.registro_2026_08 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8529 (class 1259 OID 189454)
-- Name: registro_2026_09_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_09_audit_timestamp_idx ON audit.registro_2026_09 USING btree (audit_timestamp DESC);


--
-- TOC entry 8530 (class 1259 OID 189455)
-- Name: registro_2026_09_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_09_diff_jsonb_idx ON audit.registro_2026_09 USING gin (diff_jsonb);


--
-- TOC entry 8531 (class 1259 OID 189456)
-- Name: registro_2026_09_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_09_operacion_audit_timestamp_idx ON audit.registro_2026_09 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8532 (class 1259 OID 189457)
-- Name: registro_2026_09_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_09_pk_valor_idx ON audit.registro_2026_09 USING gin (pk_valor);


--
-- TOC entry 8535 (class 1259 OID 189458)
-- Name: registro_2026_09_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_09_sesion_id_idx ON audit.registro_2026_09 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8536 (class 1259 OID 189459)
-- Name: registro_2026_09_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_09_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_09 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8537 (class 1259 OID 189460)
-- Name: registro_2026_09_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_09_usuario_id_audit_timestamp_idx ON audit.registro_2026_09 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8538 (class 1259 OID 189461)
-- Name: registro_2026_10_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_10_audit_timestamp_idx ON audit.registro_2026_10 USING btree (audit_timestamp DESC);


--
-- TOC entry 8539 (class 1259 OID 189462)
-- Name: registro_2026_10_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_10_diff_jsonb_idx ON audit.registro_2026_10 USING gin (diff_jsonb);


--
-- TOC entry 8540 (class 1259 OID 189463)
-- Name: registro_2026_10_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_10_operacion_audit_timestamp_idx ON audit.registro_2026_10 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8541 (class 1259 OID 189464)
-- Name: registro_2026_10_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_10_pk_valor_idx ON audit.registro_2026_10 USING gin (pk_valor);


--
-- TOC entry 8544 (class 1259 OID 189465)
-- Name: registro_2026_10_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_10_sesion_id_idx ON audit.registro_2026_10 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8545 (class 1259 OID 189466)
-- Name: registro_2026_10_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_10_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_10 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8546 (class 1259 OID 189467)
-- Name: registro_2026_10_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_10_usuario_id_audit_timestamp_idx ON audit.registro_2026_10 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8547 (class 1259 OID 189468)
-- Name: registro_2026_11_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_11_audit_timestamp_idx ON audit.registro_2026_11 USING btree (audit_timestamp DESC);


--
-- TOC entry 8548 (class 1259 OID 189469)
-- Name: registro_2026_11_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_11_diff_jsonb_idx ON audit.registro_2026_11 USING gin (diff_jsonb);


--
-- TOC entry 8549 (class 1259 OID 189470)
-- Name: registro_2026_11_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_11_operacion_audit_timestamp_idx ON audit.registro_2026_11 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8550 (class 1259 OID 189471)
-- Name: registro_2026_11_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_11_pk_valor_idx ON audit.registro_2026_11 USING gin (pk_valor);


--
-- TOC entry 8553 (class 1259 OID 189472)
-- Name: registro_2026_11_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_11_sesion_id_idx ON audit.registro_2026_11 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8554 (class 1259 OID 189473)
-- Name: registro_2026_11_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_11_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_11 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8555 (class 1259 OID 189474)
-- Name: registro_2026_11_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_11_usuario_id_audit_timestamp_idx ON audit.registro_2026_11 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8556 (class 1259 OID 189475)
-- Name: registro_2026_12_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_12_audit_timestamp_idx ON audit.registro_2026_12 USING btree (audit_timestamp DESC);


--
-- TOC entry 8557 (class 1259 OID 189476)
-- Name: registro_2026_12_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_12_diff_jsonb_idx ON audit.registro_2026_12 USING gin (diff_jsonb);


--
-- TOC entry 8558 (class 1259 OID 189477)
-- Name: registro_2026_12_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_12_operacion_audit_timestamp_idx ON audit.registro_2026_12 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8559 (class 1259 OID 189478)
-- Name: registro_2026_12_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_12_pk_valor_idx ON audit.registro_2026_12 USING gin (pk_valor);


--
-- TOC entry 8562 (class 1259 OID 189479)
-- Name: registro_2026_12_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_12_sesion_id_idx ON audit.registro_2026_12 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8563 (class 1259 OID 189480)
-- Name: registro_2026_12_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_12_tabla_nombre_audit_timestamp_idx ON audit.registro_2026_12 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8564 (class 1259 OID 189481)
-- Name: registro_2026_12_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2026_12_usuario_id_audit_timestamp_idx ON audit.registro_2026_12 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8565 (class 1259 OID 189482)
-- Name: registro_2027_01_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_01_audit_timestamp_idx ON audit.registro_2027_01 USING btree (audit_timestamp DESC);


--
-- TOC entry 8566 (class 1259 OID 189483)
-- Name: registro_2027_01_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_01_diff_jsonb_idx ON audit.registro_2027_01 USING gin (diff_jsonb);


--
-- TOC entry 8567 (class 1259 OID 189484)
-- Name: registro_2027_01_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_01_operacion_audit_timestamp_idx ON audit.registro_2027_01 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8568 (class 1259 OID 189485)
-- Name: registro_2027_01_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_01_pk_valor_idx ON audit.registro_2027_01 USING gin (pk_valor);


--
-- TOC entry 8571 (class 1259 OID 189486)
-- Name: registro_2027_01_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_01_sesion_id_idx ON audit.registro_2027_01 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8572 (class 1259 OID 189487)
-- Name: registro_2027_01_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_01_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_01 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8573 (class 1259 OID 189488)
-- Name: registro_2027_01_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_01_usuario_id_audit_timestamp_idx ON audit.registro_2027_01 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8574 (class 1259 OID 189489)
-- Name: registro_2027_02_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_02_audit_timestamp_idx ON audit.registro_2027_02 USING btree (audit_timestamp DESC);


--
-- TOC entry 8575 (class 1259 OID 189490)
-- Name: registro_2027_02_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_02_diff_jsonb_idx ON audit.registro_2027_02 USING gin (diff_jsonb);


--
-- TOC entry 8576 (class 1259 OID 189491)
-- Name: registro_2027_02_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_02_operacion_audit_timestamp_idx ON audit.registro_2027_02 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8577 (class 1259 OID 189492)
-- Name: registro_2027_02_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_02_pk_valor_idx ON audit.registro_2027_02 USING gin (pk_valor);


--
-- TOC entry 8580 (class 1259 OID 189493)
-- Name: registro_2027_02_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_02_sesion_id_idx ON audit.registro_2027_02 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8581 (class 1259 OID 189494)
-- Name: registro_2027_02_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_02_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_02 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8582 (class 1259 OID 189495)
-- Name: registro_2027_02_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_02_usuario_id_audit_timestamp_idx ON audit.registro_2027_02 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8583 (class 1259 OID 189496)
-- Name: registro_2027_03_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_03_audit_timestamp_idx ON audit.registro_2027_03 USING btree (audit_timestamp DESC);


--
-- TOC entry 8584 (class 1259 OID 189497)
-- Name: registro_2027_03_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_03_diff_jsonb_idx ON audit.registro_2027_03 USING gin (diff_jsonb);


--
-- TOC entry 8585 (class 1259 OID 189498)
-- Name: registro_2027_03_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_03_operacion_audit_timestamp_idx ON audit.registro_2027_03 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8586 (class 1259 OID 189499)
-- Name: registro_2027_03_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_03_pk_valor_idx ON audit.registro_2027_03 USING gin (pk_valor);


--
-- TOC entry 8589 (class 1259 OID 189500)
-- Name: registro_2027_03_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_03_sesion_id_idx ON audit.registro_2027_03 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8590 (class 1259 OID 189501)
-- Name: registro_2027_03_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_03_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_03 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8591 (class 1259 OID 189502)
-- Name: registro_2027_03_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_03_usuario_id_audit_timestamp_idx ON audit.registro_2027_03 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8592 (class 1259 OID 189503)
-- Name: registro_2027_04_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_04_audit_timestamp_idx ON audit.registro_2027_04 USING btree (audit_timestamp DESC);


--
-- TOC entry 8593 (class 1259 OID 189504)
-- Name: registro_2027_04_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_04_diff_jsonb_idx ON audit.registro_2027_04 USING gin (diff_jsonb);


--
-- TOC entry 8594 (class 1259 OID 189505)
-- Name: registro_2027_04_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_04_operacion_audit_timestamp_idx ON audit.registro_2027_04 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8595 (class 1259 OID 189506)
-- Name: registro_2027_04_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_04_pk_valor_idx ON audit.registro_2027_04 USING gin (pk_valor);


--
-- TOC entry 8598 (class 1259 OID 189507)
-- Name: registro_2027_04_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_04_sesion_id_idx ON audit.registro_2027_04 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8599 (class 1259 OID 189508)
-- Name: registro_2027_04_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_04_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_04 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8600 (class 1259 OID 189509)
-- Name: registro_2027_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_04_usuario_id_audit_timestamp_idx ON audit.registro_2027_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8601 (class 1259 OID 189510)
-- Name: registro_2027_05_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_05_audit_timestamp_idx ON audit.registro_2027_05 USING btree (audit_timestamp DESC);


--
-- TOC entry 8602 (class 1259 OID 189511)
-- Name: registro_2027_05_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_05_diff_jsonb_idx ON audit.registro_2027_05 USING gin (diff_jsonb);


--
-- TOC entry 8603 (class 1259 OID 189512)
-- Name: registro_2027_05_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_05_operacion_audit_timestamp_idx ON audit.registro_2027_05 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8604 (class 1259 OID 189513)
-- Name: registro_2027_05_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_05_pk_valor_idx ON audit.registro_2027_05 USING gin (pk_valor);


--
-- TOC entry 8607 (class 1259 OID 189514)
-- Name: registro_2027_05_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_05_sesion_id_idx ON audit.registro_2027_05 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8608 (class 1259 OID 189515)
-- Name: registro_2027_05_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_05_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_05 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8609 (class 1259 OID 189516)
-- Name: registro_2027_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_05_usuario_id_audit_timestamp_idx ON audit.registro_2027_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8610 (class 1259 OID 189517)
-- Name: registro_2027_06_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_06_audit_timestamp_idx ON audit.registro_2027_06 USING btree (audit_timestamp DESC);


--
-- TOC entry 8611 (class 1259 OID 189518)
-- Name: registro_2027_06_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_06_diff_jsonb_idx ON audit.registro_2027_06 USING gin (diff_jsonb);


--
-- TOC entry 8612 (class 1259 OID 189519)
-- Name: registro_2027_06_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_06_operacion_audit_timestamp_idx ON audit.registro_2027_06 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8613 (class 1259 OID 189520)
-- Name: registro_2027_06_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_06_pk_valor_idx ON audit.registro_2027_06 USING gin (pk_valor);


--
-- TOC entry 8616 (class 1259 OID 189521)
-- Name: registro_2027_06_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_06_sesion_id_idx ON audit.registro_2027_06 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8617 (class 1259 OID 189522)
-- Name: registro_2027_06_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_06_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_06 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8618 (class 1259 OID 189523)
-- Name: registro_2027_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_06_usuario_id_audit_timestamp_idx ON audit.registro_2027_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8619 (class 1259 OID 189524)
-- Name: registro_2027_07_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_07_audit_timestamp_idx ON audit.registro_2027_07 USING btree (audit_timestamp DESC);


--
-- TOC entry 8620 (class 1259 OID 189525)
-- Name: registro_2027_07_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_07_diff_jsonb_idx ON audit.registro_2027_07 USING gin (diff_jsonb);


--
-- TOC entry 8621 (class 1259 OID 189526)
-- Name: registro_2027_07_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_07_operacion_audit_timestamp_idx ON audit.registro_2027_07 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8622 (class 1259 OID 189527)
-- Name: registro_2027_07_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_07_pk_valor_idx ON audit.registro_2027_07 USING gin (pk_valor);


--
-- TOC entry 8625 (class 1259 OID 189528)
-- Name: registro_2027_07_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_07_sesion_id_idx ON audit.registro_2027_07 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8626 (class 1259 OID 189529)
-- Name: registro_2027_07_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_07_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_07 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8627 (class 1259 OID 189530)
-- Name: registro_2027_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_07_usuario_id_audit_timestamp_idx ON audit.registro_2027_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8628 (class 1259 OID 189531)
-- Name: registro_2027_08_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_08_audit_timestamp_idx ON audit.registro_2027_08 USING btree (audit_timestamp DESC);


--
-- TOC entry 8629 (class 1259 OID 189532)
-- Name: registro_2027_08_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_08_diff_jsonb_idx ON audit.registro_2027_08 USING gin (diff_jsonb);


--
-- TOC entry 8630 (class 1259 OID 189533)
-- Name: registro_2027_08_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_08_operacion_audit_timestamp_idx ON audit.registro_2027_08 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8631 (class 1259 OID 189534)
-- Name: registro_2027_08_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_08_pk_valor_idx ON audit.registro_2027_08 USING gin (pk_valor);


--
-- TOC entry 8634 (class 1259 OID 189535)
-- Name: registro_2027_08_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_08_sesion_id_idx ON audit.registro_2027_08 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8635 (class 1259 OID 189536)
-- Name: registro_2027_08_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_08_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_08 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8636 (class 1259 OID 189537)
-- Name: registro_2027_08_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_08_usuario_id_audit_timestamp_idx ON audit.registro_2027_08 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8637 (class 1259 OID 189538)
-- Name: registro_2027_09_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_09_audit_timestamp_idx ON audit.registro_2027_09 USING btree (audit_timestamp DESC);


--
-- TOC entry 8638 (class 1259 OID 189539)
-- Name: registro_2027_09_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_09_diff_jsonb_idx ON audit.registro_2027_09 USING gin (diff_jsonb);


--
-- TOC entry 8639 (class 1259 OID 189540)
-- Name: registro_2027_09_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_09_operacion_audit_timestamp_idx ON audit.registro_2027_09 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8640 (class 1259 OID 189541)
-- Name: registro_2027_09_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_09_pk_valor_idx ON audit.registro_2027_09 USING gin (pk_valor);


--
-- TOC entry 8643 (class 1259 OID 189542)
-- Name: registro_2027_09_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_09_sesion_id_idx ON audit.registro_2027_09 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8644 (class 1259 OID 189543)
-- Name: registro_2027_09_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_09_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_09 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8645 (class 1259 OID 189544)
-- Name: registro_2027_09_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_09_usuario_id_audit_timestamp_idx ON audit.registro_2027_09 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8646 (class 1259 OID 189545)
-- Name: registro_2027_10_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_10_audit_timestamp_idx ON audit.registro_2027_10 USING btree (audit_timestamp DESC);


--
-- TOC entry 8647 (class 1259 OID 189546)
-- Name: registro_2027_10_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_10_diff_jsonb_idx ON audit.registro_2027_10 USING gin (diff_jsonb);


--
-- TOC entry 8648 (class 1259 OID 189547)
-- Name: registro_2027_10_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_10_operacion_audit_timestamp_idx ON audit.registro_2027_10 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8649 (class 1259 OID 189548)
-- Name: registro_2027_10_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_10_pk_valor_idx ON audit.registro_2027_10 USING gin (pk_valor);


--
-- TOC entry 8652 (class 1259 OID 189549)
-- Name: registro_2027_10_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_10_sesion_id_idx ON audit.registro_2027_10 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8653 (class 1259 OID 189550)
-- Name: registro_2027_10_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_10_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_10 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8654 (class 1259 OID 189551)
-- Name: registro_2027_10_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_10_usuario_id_audit_timestamp_idx ON audit.registro_2027_10 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8655 (class 1259 OID 189552)
-- Name: registro_2027_11_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_11_audit_timestamp_idx ON audit.registro_2027_11 USING btree (audit_timestamp DESC);


--
-- TOC entry 8656 (class 1259 OID 189553)
-- Name: registro_2027_11_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_11_diff_jsonb_idx ON audit.registro_2027_11 USING gin (diff_jsonb);


--
-- TOC entry 8657 (class 1259 OID 189554)
-- Name: registro_2027_11_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_11_operacion_audit_timestamp_idx ON audit.registro_2027_11 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8658 (class 1259 OID 189555)
-- Name: registro_2027_11_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_11_pk_valor_idx ON audit.registro_2027_11 USING gin (pk_valor);


--
-- TOC entry 8661 (class 1259 OID 189556)
-- Name: registro_2027_11_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_11_sesion_id_idx ON audit.registro_2027_11 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8662 (class 1259 OID 189557)
-- Name: registro_2027_11_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_11_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_11 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8663 (class 1259 OID 189558)
-- Name: registro_2027_11_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_11_usuario_id_audit_timestamp_idx ON audit.registro_2027_11 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8664 (class 1259 OID 189559)
-- Name: registro_2027_12_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_12_audit_timestamp_idx ON audit.registro_2027_12 USING btree (audit_timestamp DESC);


--
-- TOC entry 8665 (class 1259 OID 189560)
-- Name: registro_2027_12_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_12_diff_jsonb_idx ON audit.registro_2027_12 USING gin (diff_jsonb);


--
-- TOC entry 8666 (class 1259 OID 189561)
-- Name: registro_2027_12_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_12_operacion_audit_timestamp_idx ON audit.registro_2027_12 USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8667 (class 1259 OID 189562)
-- Name: registro_2027_12_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_12_pk_valor_idx ON audit.registro_2027_12 USING gin (pk_valor);


--
-- TOC entry 8670 (class 1259 OID 189563)
-- Name: registro_2027_12_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_12_sesion_id_idx ON audit.registro_2027_12 USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8671 (class 1259 OID 189564)
-- Name: registro_2027_12_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_12_tabla_nombre_audit_timestamp_idx ON audit.registro_2027_12 USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8672 (class 1259 OID 189565)
-- Name: registro_2027_12_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_2027_12_usuario_id_audit_timestamp_idx ON audit.registro_2027_12 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8673 (class 1259 OID 189566)
-- Name: registro_default_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_default_audit_timestamp_idx ON audit.registro_default USING btree (audit_timestamp DESC);


--
-- TOC entry 8674 (class 1259 OID 189567)
-- Name: registro_default_diff_jsonb_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_default_diff_jsonb_idx ON audit.registro_default USING gin (diff_jsonb);


--
-- TOC entry 8675 (class 1259 OID 189568)
-- Name: registro_default_operacion_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_default_operacion_audit_timestamp_idx ON audit.registro_default USING btree (operacion, audit_timestamp DESC);


--
-- TOC entry 8676 (class 1259 OID 189569)
-- Name: registro_default_pk_valor_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_default_pk_valor_idx ON audit.registro_default USING gin (pk_valor);


--
-- TOC entry 8679 (class 1259 OID 189570)
-- Name: registro_default_sesion_id_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_default_sesion_id_idx ON audit.registro_default USING btree (sesion_id) WHERE (sesion_id IS NOT NULL);


--
-- TOC entry 8680 (class 1259 OID 189571)
-- Name: registro_default_tabla_nombre_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_default_tabla_nombre_audit_timestamp_idx ON audit.registro_default USING btree (tabla_nombre, audit_timestamp DESC);


--
-- TOC entry 8681 (class 1259 OID 189572)
-- Name: registro_default_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX registro_default_usuario_id_audit_timestamp_idx ON audit.registro_default USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8691 (class 1259 OID 189573)
-- Name: sesion_2026_04_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_04_evento_audit_timestamp_idx ON audit.sesion_2026_04 USING btree (evento, audit_timestamp DESC);


--
-- TOC entry 8692 (class 1259 OID 189574)
-- Name: sesion_2026_04_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_04_ip_address_audit_timestamp_idx ON audit.sesion_2026_04 USING btree (ip_address, audit_timestamp DESC);


--
-- TOC entry 8695 (class 1259 OID 189575)
-- Name: sesion_2026_04_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_04_usuario_id_audit_timestamp_idx ON audit.sesion_2026_04 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8696 (class 1259 OID 189576)
-- Name: sesion_2026_05_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_05_evento_audit_timestamp_idx ON audit.sesion_2026_05 USING btree (evento, audit_timestamp DESC);


--
-- TOC entry 8697 (class 1259 OID 189577)
-- Name: sesion_2026_05_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_05_ip_address_audit_timestamp_idx ON audit.sesion_2026_05 USING btree (ip_address, audit_timestamp DESC);


--
-- TOC entry 8700 (class 1259 OID 189578)
-- Name: sesion_2026_05_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_05_usuario_id_audit_timestamp_idx ON audit.sesion_2026_05 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8701 (class 1259 OID 189579)
-- Name: sesion_2026_06_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_06_evento_audit_timestamp_idx ON audit.sesion_2026_06 USING btree (evento, audit_timestamp DESC);


--
-- TOC entry 8702 (class 1259 OID 189580)
-- Name: sesion_2026_06_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_06_ip_address_audit_timestamp_idx ON audit.sesion_2026_06 USING btree (ip_address, audit_timestamp DESC);


--
-- TOC entry 8705 (class 1259 OID 189581)
-- Name: sesion_2026_06_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_06_usuario_id_audit_timestamp_idx ON audit.sesion_2026_06 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8706 (class 1259 OID 189582)
-- Name: sesion_2026_07_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_07_evento_audit_timestamp_idx ON audit.sesion_2026_07 USING btree (evento, audit_timestamp DESC);


--
-- TOC entry 8707 (class 1259 OID 189583)
-- Name: sesion_2026_07_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_07_ip_address_audit_timestamp_idx ON audit.sesion_2026_07 USING btree (ip_address, audit_timestamp DESC);


--
-- TOC entry 8710 (class 1259 OID 189584)
-- Name: sesion_2026_07_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_2026_07_usuario_id_audit_timestamp_idx ON audit.sesion_2026_07 USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8711 (class 1259 OID 189585)
-- Name: sesion_default_evento_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_default_evento_audit_timestamp_idx ON audit.sesion_default USING btree (evento, audit_timestamp DESC);


--
-- TOC entry 8712 (class 1259 OID 189586)
-- Name: sesion_default_ip_address_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_default_ip_address_audit_timestamp_idx ON audit.sesion_default USING btree (ip_address, audit_timestamp DESC);


--
-- TOC entry 8715 (class 1259 OID 189587)
-- Name: sesion_default_usuario_id_audit_timestamp_idx; Type: INDEX; Schema: audit; Owner: -
--

CREATE INDEX sesion_default_usuario_id_audit_timestamp_idx ON audit.sesion_default USING btree (usuario_id, audit_timestamp DESC);


--
-- TOC entry 8725 (class 1259 OID 189588)
-- Name: idx_acometida_clave_catastral; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acometida_clave_catastral ON public.acometida USING btree (clave_catastral);


--
-- TOC entry 8726 (class 1259 OID 189589)
-- Name: idx_acometida_cliente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acometida_cliente_id ON public.acometida USING btree (cliente_id);


--
-- TOC entry 8727 (class 1259 OID 189590)
-- Name: idx_acometida_cuenta; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acometida_cuenta ON public.acometida USING btree (cuenta);


--
-- TOC entry 9152 (class 1259 OID 190718)
-- Name: idx_acometida_estado_activo; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_acometida_estado_activo ON public.historial_estados_acometida USING btree (acometida_id) WHERE (activo = true);


--
-- TOC entry 8728 (class 1259 OID 189591)
-- Name: idx_acometida_fecha_instalacion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acometida_fecha_instalacion ON public.acometida USING btree (fecha_instalacion);


--
-- TOC entry 8729 (class 1259 OID 189592)
-- Name: idx_acometida_sector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acometida_sector ON public.acometida USING btree (sector);


--
-- TOC entry 8730 (class 1259 OID 189593)
-- Name: idx_acometida_tarifa_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acometida_tarifa_id ON public.acometida USING btree (tarifa_id);


--
-- TOC entry 8731 (class 1259 OID 189594)
-- Name: idx_acometida_zona_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_acometida_zona_id ON public.acometida USING btree (zona_id);


--
-- TOC entry 9155 (class 1259 OID 190821)
-- Name: idx_audit_busqueda; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_busqueda ON public.auditoria_lectura_sector USING btree (mes_lectura, sector_id, completo);


--
-- TOC entry 8734 (class 1259 OID 189595)
-- Name: idx_canton_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canton_nombre ON public.canton USING btree (nombre);


--
-- TOC entry 8735 (class 1259 OID 189596)
-- Name: idx_canton_provincia_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_canton_provincia_id ON public.canton USING btree (provincia_id);


--
-- TOC entry 8744 (class 1259 OID 189597)
-- Name: idx_categoria_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categoria_nombre ON public.categoria USING btree (nombre);


--
-- TOC entry 8747 (class 1259 OID 189598)
-- Name: idx_ciudadano_apellidos; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ciudadano_apellidos ON public.ciudadano USING btree (apellidos);


--
-- TOC entry 8748 (class 1259 OID 189599)
-- Name: idx_ciudadano_estado_civil_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ciudadano_estado_civil_id ON public.ciudadano USING btree (estado_civil_id);


--
-- TOC entry 8749 (class 1259 OID 189600)
-- Name: idx_ciudadano_nombres; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ciudadano_nombres ON public.ciudadano USING btree (nombres);


--
-- TOC entry 8750 (class 1259 OID 189601)
-- Name: idx_ciudadano_parroquia_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ciudadano_parroquia_id ON public.ciudadano USING btree (parroquia_id);


--
-- TOC entry 8751 (class 1259 OID 189602)
-- Name: idx_ciudadano_profesion_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ciudadano_profesion_id ON public.ciudadano USING btree (profesion_id);


--
-- TOC entry 8752 (class 1259 OID 189603)
-- Name: idx_ciudadano_sexo_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ciudadano_sexo_id ON public.ciudadano USING btree (sexo_id);


--
-- TOC entry 8769 (class 1259 OID 189604)
-- Name: idx_cliente_persona_natural_ciudadano_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_persona_natural_ciudadano_id ON public.cliente_persona_natural USING btree (ciudadano_id);


--
-- TOC entry 8770 (class 1259 OID 189605)
-- Name: idx_cliente_persona_natural_cliente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_persona_natural_cliente_id ON public.cliente_persona_natural USING btree (cliente_id);


--
-- TOC entry 8757 (class 1259 OID 189606)
-- Name: idx_cliente_tipo_identificacion_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_tipo_identificacion_id ON public.cliente USING btree (tipo_identificacion_id);


--
-- TOC entry 8779 (class 1259 OID 189607)
-- Name: idx_cliente_usuario_cliente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_usuario_cliente_id ON public.cliente_usuario USING btree (cliente_id);


--
-- TOC entry 8780 (class 1259 OID 189608)
-- Name: idx_cliente_usuario_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_usuario_created_at ON public.cliente_usuario USING btree (created_at);


--
-- TOC entry 8781 (class 1259 OID 189609)
-- Name: idx_cliente_usuario_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_usuario_deleted_at ON public.cliente_usuario USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- TOC entry 8782 (class 1259 OID 189610)
-- Name: idx_cliente_usuario_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_usuario_email ON public.cliente_usuario USING btree (email);


--
-- TOC entry 8783 (class 1259 OID 189611)
-- Name: idx_cliente_usuario_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_usuario_estado ON public.cliente_usuario USING btree (estado_cliente_usuario_id);


--
-- TOC entry 8784 (class 1259 OID 189612)
-- Name: idx_cliente_usuario_failed_attempts; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_usuario_failed_attempts ON public.cliente_usuario USING btree (failed_attempts);


--
-- TOC entry 8785 (class 1259 OID 189613)
-- Name: idx_cliente_usuario_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_usuario_is_active ON public.cliente_usuario USING btree (is_active);


--
-- TOC entry 8786 (class 1259 OID 189614)
-- Name: idx_cliente_usuario_locked_out; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cliente_usuario_locked_out ON public.cliente_usuario USING btree (cliente_usuario_id) WHERE (is_locked_out = true);


--
-- TOC entry 8789 (class 1259 OID 189615)
-- Name: idx_componentes_fijos_servicio_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_componentes_fijos_servicio_id ON public.componentes_fijos USING btree (servicio_id);


--
-- TOC entry 8790 (class 1259 OID 189616)
-- Name: idx_componentes_fijos_tarifa_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_componentes_fijos_tarifa_id ON public.componentes_fijos USING btree (tarifa_id);


--
-- TOC entry 8793 (class 1259 OID 189617)
-- Name: idx_consumo_promedio_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_consumo_promedio_updated_at ON public.consumo_promedio USING btree (updated_at);


--
-- TOC entry 8760 (class 1259 OID 189618)
-- Name: idx_correo_electronico_cliente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_correo_electronico_cliente_id ON public.correo_electronico USING btree (cliente_id);


--
-- TOC entry 8761 (class 1259 OID 189619)
-- Name: idx_correo_electronico_correo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_correo_electronico_correo ON public.correo_electronico USING btree (email);


--
-- TOC entry 8794 (class 1259 OID 189620)
-- Name: idx_correo_empresa_correo_electronico_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_correo_empresa_correo_electronico_id ON public.correo_empresa USING btree (correo_electronico_id);


--
-- TOC entry 8795 (class 1259 OID 189621)
-- Name: idx_correo_empresa_empresa_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_correo_empresa_empresa_id ON public.correo_empresa USING btree (empresa_id);


--
-- TOC entry 8798 (class 1259 OID 189622)
-- Name: idx_correo_persona_natural_cliente_persona_natural_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_correo_persona_natural_cliente_persona_natural_id ON public.correo_persona_natural USING btree (cliente_persona_natural_id);


--
-- TOC entry 8799 (class 1259 OID 189623)
-- Name: idx_correo_persona_natural_correo_electronico_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_correo_persona_natural_correo_electronico_id ON public.correo_persona_natural USING btree (correo_electronico_id);


--
-- TOC entry 8802 (class 1259 OID 189624)
-- Name: idx_direccion_parroquia_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_direccion_parroquia_id ON public.direccion USING btree (parroquia_id);


--
-- TOC entry 8813 (class 1259 OID 189625)
-- Name: idx_empleados_cargo_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empleados_cargo_id ON public.empleados USING btree (cargo_id);


--
-- TOC entry 8814 (class 1259 OID 189626)
-- Name: idx_empleados_ciudadano_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empleados_ciudadano_id ON public.empleados USING btree (ciudadano_id);


--
-- TOC entry 8815 (class 1259 OID 189627)
-- Name: idx_empleados_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empleados_deleted_at ON public.empleados USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- TOC entry 8816 (class 1259 OID 189628)
-- Name: idx_empleados_estado_empleado_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empleados_estado_empleado_id ON public.empleados USING btree (estado_empleado_id);


--
-- TOC entry 8817 (class 1259 OID 189629)
-- Name: idx_empleados_fecha_ingreso; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empleados_fecha_ingreso ON public.empleados USING btree (fecha_ingreso);


--
-- TOC entry 8818 (class 1259 OID 189630)
-- Name: idx_empleados_usuario_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empleados_usuario_id ON public.empleados USING btree (usuario_id);


--
-- TOC entry 8819 (class 1259 OID 189631)
-- Name: idx_empresa_cliente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empresa_cliente_id ON public.empresa USING btree (cliente_id);


--
-- TOC entry 8820 (class 1259 OID 189632)
-- Name: idx_empresa_nombre_comercial; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empresa_nombre_comercial ON public.empresa USING btree (nombre_comercial);


--
-- TOC entry 8821 (class 1259 OID 189633)
-- Name: idx_empresa_parroquia_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empresa_parroquia_id ON public.empresa USING btree (parroquia_id);


--
-- TOC entry 8822 (class 1259 OID 189634)
-- Name: idx_empresa_razon_social; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empresa_razon_social ON public.empresa USING btree (razon_social);


--
-- TOC entry 8823 (class 1259 OID 189635)
-- Name: idx_empresa_ruc; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_empresa_ruc ON public.empresa USING btree (ruc);


--
-- TOC entry 8828 (class 1259 OID 189636)
-- Name: idx_estado_civil_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_estado_civil_nombre ON public.estado_civil USING btree (nombre);


--
-- TOC entry 8839 (class 1259 OID 189637)
-- Name: idx_estado_pago_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_estado_pago_nombre ON public.estado_pago USING btree (nombre);


--
-- TOC entry 8842 (class 1259 OID 189638)
-- Name: idx_factura_cliente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factura_cliente_id ON public.factura USING btree (cliente_id);


--
-- TOC entry 8843 (class 1259 OID 189639)
-- Name: idx_factura_estado_pago_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factura_estado_pago_id ON public.factura USING btree (estado_pago_id);


--
-- TOC entry 8844 (class 1259 OID 189640)
-- Name: idx_factura_fecha_registro; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factura_fecha_registro ON public.factura USING btree (fecha_registro);


--
-- TOC entry 8845 (class 1259 OID 189641)
-- Name: idx_factura_fecha_vencimiento; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factura_fecha_vencimiento ON public.factura USING btree (fecha_vencimiento);


--
-- TOC entry 8846 (class 1259 OID 189642)
-- Name: idx_factura_forma_pago_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factura_forma_pago_id ON public.factura USING btree (forma_pago_id);


--
-- TOC entry 8847 (class 1259 OID 189643)
-- Name: idx_factura_numero_factura; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_factura_numero_factura ON public.factura USING btree (numero_factura);


--
-- TOC entry 8850 (class 1259 OID 189644)
-- Name: idx_forma_pago_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_forma_pago_nombre ON public.forma_pago USING btree (nombre);


--
-- TOC entry 8853 (class 1259 OID 189645)
-- Name: idx_foto_acometida_acometida_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_foto_acometida_acometida_id ON public.foto_acometida USING btree (acometida_id);


--
-- TOC entry 8854 (class 1259 OID 189646)
-- Name: idx_foto_acometida_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_foto_acometida_created_at ON public.foto_acometida USING btree (created_at);


--
-- TOC entry 8857 (class 1259 OID 189647)
-- Name: idx_foto_lectura_clave_catastral; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_foto_lectura_clave_catastral ON public.foto_lectura USING btree (clave_catastral);


--
-- TOC entry 8858 (class 1259 OID 189648)
-- Name: idx_foto_lectura_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_foto_lectura_created_at ON public.foto_lectura USING btree (created_at);


--
-- TOC entry 8859 (class 1259 OID 189649)
-- Name: idx_foto_lectura_lectura_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_foto_lectura_lectura_id ON public.foto_lectura USING btree (lectura_id);


--
-- TOC entry 8862 (class 1259 OID 189650)
-- Name: idx_lectura_acometida_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_acometida_id ON public.lectura USING btree (acometida_id);


--
-- TOC entry 8863 (class 1259 OID 189651)
-- Name: idx_lectura_clave_catastral; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_clave_catastral ON public.lectura USING btree (clave_catastral);


--
-- TOC entry 8864 (class 1259 OID 189652)
-- Name: idx_lectura_cuenta; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_cuenta ON public.lectura USING btree (cuenta);


--
-- TOC entry 8871 (class 1259 OID 189653)
-- Name: idx_lectura_estado_codigo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_estado_codigo ON public.lectura_estado USING btree (codigo);


--
-- TOC entry 8872 (class 1259 OID 189654)
-- Name: idx_lectura_estado_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_estado_nombre ON public.lectura_estado USING btree (nombre);


--
-- TOC entry 8873 (class 1259 OID 189655)
-- Name: idx_lectura_estado_tipo_estado_lectura_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_estado_tipo_estado_lectura_id ON public.lectura_estado USING btree (tipo_estado_lectura_id);


--
-- TOC entry 8865 (class 1259 OID 189656)
-- Name: idx_lectura_fecha_lectura; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_fecha_lectura ON public.lectura USING btree (fecha_lectura);


--
-- TOC entry 8866 (class 1259 OID 189657)
-- Name: idx_lectura_lectura_estado_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_lectura_estado_id ON public.lectura USING btree (lectura_estado_id);


--
-- TOC entry 8867 (class 1259 OID 189658)
-- Name: idx_lectura_sector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_sector ON public.lectura USING btree (sector);


--
-- TOC entry 8868 (class 1259 OID 189659)
-- Name: idx_lectura_tipo_novedad_lectura_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lectura_tipo_novedad_lectura_id ON public.lectura USING btree (tipo_novedad_lectura_id);


--
-- TOC entry 8883 (class 1259 OID 189660)
-- Name: idx_observacion_acometida_acometida_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_acometida_acometida_id ON public.observacion_acometida USING btree (acometida_id);


--
-- TOC entry 8884 (class 1259 OID 189661)
-- Name: idx_observacion_acometida_fecha_registro; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_acometida_fecha_registro ON public.observacion_acometida USING btree (fecha_registro);


--
-- TOC entry 8885 (class 1259 OID 189662)
-- Name: idx_observacion_acometida_observacion_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_acometida_observacion_id ON public.observacion_acometida USING btree (observacion_id);


--
-- TOC entry 8888 (class 1259 OID 189663)
-- Name: idx_observacion_factura_factura_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_factura_factura_id ON public.observacion_factura USING btree (factura_id);


--
-- TOC entry 8889 (class 1259 OID 189664)
-- Name: idx_observacion_factura_fecha_registro; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_factura_fecha_registro ON public.observacion_factura USING btree (fecha_registro);


--
-- TOC entry 8890 (class 1259 OID 189665)
-- Name: idx_observacion_factura_observacion_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_factura_observacion_id ON public.observacion_factura USING btree (observacion_id);


--
-- TOC entry 8893 (class 1259 OID 189666)
-- Name: idx_observacion_lectura_fecha_registro; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_lectura_fecha_registro ON public.observacion_lectura USING btree (fecha_registro);


--
-- TOC entry 8894 (class 1259 OID 189667)
-- Name: idx_observacion_lectura_lectura_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_lectura_lectura_id ON public.observacion_lectura USING btree (lectura_id);


--
-- TOC entry 8895 (class 1259 OID 189668)
-- Name: idx_observacion_lectura_observacion_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_lectura_observacion_id ON public.observacion_lectura USING btree (observacion_id);


--
-- TOC entry 8880 (class 1259 OID 189669)
-- Name: idx_observacion_titulo_observacion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_observacion_titulo_observacion ON public.observacion USING btree (titulo_observacion);


--
-- TOC entry 8898 (class 1259 OID 189670)
-- Name: idx_pais_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pais_nombre ON public.pais USING btree (nombre);


--
-- TOC entry 8901 (class 1259 OID 189671)
-- Name: idx_parroquia_canton_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_parroquia_canton_id ON public.parroquia USING btree (canton_id);


--
-- TOC entry 8902 (class 1259 OID 189672)
-- Name: idx_parroquia_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_parroquia_nombre ON public.parroquia USING btree (nombre);


--
-- TOC entry 8903 (class 1259 OID 189673)
-- Name: idx_parroquia_tipo_parroquia_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_parroquia_tipo_parroquia_id ON public.parroquia USING btree (tipo_parroquia_id);


--
-- TOC entry 8910 (class 1259 OID 189674)
-- Name: idx_permisos_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_permisos_nombre ON public.permisos USING btree (nombre);


--
-- TOC entry 8915 (class 1259 OID 189675)
-- Name: idx_predio_altitud; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_altitud ON public.predio USING btree (altitud);


--
-- TOC entry 8916 (class 1259 OID 189676)
-- Name: idx_predio_area_construccion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_area_construccion ON public.predio USING btree (area_construccion);


--
-- TOC entry 8917 (class 1259 OID 189677)
-- Name: idx_predio_area_terreno; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_area_terreno ON public.predio USING btree (area_terreno);


--
-- TOC entry 8918 (class 1259 OID 189678)
-- Name: idx_predio_callejon; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_callejon ON public.predio USING btree (callejon);


--
-- TOC entry 8919 (class 1259 OID 189679)
-- Name: idx_predio_clave_catastral; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_clave_catastral ON public.predio USING btree (clave_catastral);


--
-- TOC entry 8920 (class 1259 OID 189680)
-- Name: idx_predio_cliente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_cliente_id ON public.predio USING btree (cliente_id);


--
-- TOC entry 8921 (class 1259 OID 189681)
-- Name: idx_predio_coordenadas; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_coordenadas ON public.predio USING gist (coordenadas);


--
-- TOC entry 8922 (class 1259 OID 189682)
-- Name: idx_predio_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_created_at ON public.predio USING btree (created_at);


--
-- TOC entry 8923 (class 1259 OID 189683)
-- Name: idx_predio_direccion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_direccion ON public.predio USING btree (direccion);


--
-- TOC entry 8924 (class 1259 OID 189684)
-- Name: idx_predio_fecha_geolocalizacion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_fecha_geolocalizacion ON public.predio USING btree (fecha_geolocalizacion);


--
-- TOC entry 8925 (class 1259 OID 189685)
-- Name: idx_predio_precision; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_precision ON public.predio USING btree ("precision");


--
-- TOC entry 8926 (class 1259 OID 189686)
-- Name: idx_predio_referencia; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_referencia ON public.predio USING btree (referencia);


--
-- TOC entry 8927 (class 1259 OID 189687)
-- Name: idx_predio_sector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_sector ON public.predio USING btree (sector);


--
-- TOC entry 8928 (class 1259 OID 189688)
-- Name: idx_predio_tipo_predio_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_tipo_predio_id ON public.predio USING btree (tipo_predio_id);


--
-- TOC entry 8929 (class 1259 OID 189689)
-- Name: idx_predio_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_updated_at ON public.predio USING btree (updated_at);


--
-- TOC entry 8930 (class 1259 OID 189690)
-- Name: idx_predio_valor_comercial; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_valor_comercial ON public.predio USING btree (valor_comercial);


--
-- TOC entry 8931 (class 1259 OID 189691)
-- Name: idx_predio_valor_construccion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_valor_construccion ON public.predio USING btree (valor_construccion);


--
-- TOC entry 8932 (class 1259 OID 189692)
-- Name: idx_predio_valor_terreno; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_valor_terreno ON public.predio USING btree (valor_terreno);


--
-- TOC entry 8933 (class 1259 OID 189693)
-- Name: idx_predio_zona_geometrica; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_predio_zona_geometrica ON public.predio USING gist (zona_geometrica);


--
-- TOC entry 8938 (class 1259 OID 189694)
-- Name: idx_profesion_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profesion_nombre ON public.profesion USING btree (nombre);


--
-- TOC entry 8941 (class 1259 OID 189695)
-- Name: idx_provincia_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_provincia_nombre ON public.provincia USING btree (nombre);


--
-- TOC entry 8942 (class 1259 OID 189696)
-- Name: idx_provincia_pais_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_provincia_pais_id ON public.provincia USING btree (pais_id);


--
-- TOC entry 8945 (class 1259 OID 189697)
-- Name: idx_qrcode_acometida_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qrcode_acometida_id ON public.qrcode USING btree (acometida_id);


--
-- TOC entry 8946 (class 1259 OID 189698)
-- Name: idx_qrcode_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_qrcode_created_at ON public.qrcode USING btree (created_at);


--
-- TOC entry 8951 (class 1259 OID 189699)
-- Name: idx_rangos_variables_servicio_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rangos_variables_servicio_id ON public.rangos_variables USING btree (servicio_id);


--
-- TOC entry 8952 (class 1259 OID 189700)
-- Name: idx_rangos_variables_tarifa_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rangos_variables_tarifa_id ON public.rangos_variables USING btree (tarifa_id, min_consumo);


--
-- TOC entry 8955 (class 1259 OID 189701)
-- Name: idx_refresh_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_expires ON public.refresh_tokens USING btree (expires_at);


--
-- TOC entry 8956 (class 1259 OID 189702)
-- Name: idx_refresh_revoked; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_revoked ON public.refresh_tokens USING btree (revoked) WHERE (revoked = false);


--
-- TOC entry 8957 (class 1259 OID 189703)
-- Name: idx_refresh_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refresh_user ON public.refresh_tokens USING btree (usuario_id);


--
-- TOC entry 8964 (class 1259 OID 189704)
-- Name: idx_rol_permisos_permiso_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rol_permisos_permiso_id ON public.rol_permisos USING btree (permiso_id);


--
-- TOC entry 8965 (class 1259 OID 189705)
-- Name: idx_rol_permisos_rol_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rol_permisos_rol_id ON public.rol_permisos USING btree (rol_id);


--
-- TOC entry 8970 (class 1259 OID 189706)
-- Name: idx_roles_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_roles_nombre ON public.roles USING btree (nombre);


--
-- TOC entry 8971 (class 1259 OID 189707)
-- Name: idx_roles_parent_rol_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_roles_parent_rol_id ON public.roles USING btree (parent_rol_id);


--
-- TOC entry 8976 (class 1259 OID 189708)
-- Name: idx_seguimiento_lectura_acometida_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seguimiento_lectura_acometida_id ON public.seguimiento_lectura USING btree (acometida_id);


--
-- TOC entry 8977 (class 1259 OID 189709)
-- Name: idx_seguimiento_lectura_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seguimiento_lectura_created_at ON public.seguimiento_lectura USING btree (created_at);


--
-- TOC entry 8978 (class 1259 OID 189710)
-- Name: idx_seguimiento_lectura_lectura_estado_anterior_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seguimiento_lectura_lectura_estado_anterior_id ON public.seguimiento_lectura USING btree (lectura_estado_anterior_id);


--
-- TOC entry 8979 (class 1259 OID 189711)
-- Name: idx_seguimiento_lectura_lectura_estado_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seguimiento_lectura_lectura_estado_id ON public.seguimiento_lectura USING btree (lectura_estado_id);


--
-- TOC entry 8980 (class 1259 OID 189712)
-- Name: idx_seguimiento_lectura_lectura_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seguimiento_lectura_lectura_id ON public.seguimiento_lectura USING btree (lectura_id);


--
-- TOC entry 8981 (class 1259 OID 189713)
-- Name: idx_seguimiento_lectura_usuario_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seguimiento_lectura_usuario_id ON public.seguimiento_lectura USING btree (usuario_id);


--
-- TOC entry 8984 (class 1259 OID 189714)
-- Name: idx_servicio_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_servicio_nombre ON public.servicio USING btree (nombre);


--
-- TOC entry 8989 (class 1259 OID 189715)
-- Name: idx_sexo_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sexo_nombre ON public.sexo USING btree (nombre);


--
-- TOC entry 8992 (class 1259 OID 189716)
-- Name: idx_siguiente_lectura_acometida_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_siguiente_lectura_acometida_id ON public.siguiente_lectura USING btree (acometida_id);


--
-- TOC entry 8993 (class 1259 OID 189717)
-- Name: idx_siguiente_lectura_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_siguiente_lectura_created_at ON public.siguiente_lectura USING btree (created_at);


--
-- TOC entry 8994 (class 1259 OID 189718)
-- Name: idx_siguiente_lectura_fecha_siguiente_lectura; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_siguiente_lectura_fecha_siguiente_lectura ON public.siguiente_lectura USING btree (fecha_siguiente_lectura);


--
-- TOC entry 8995 (class 1259 OID 189719)
-- Name: idx_siguiente_lectura_ultima_lectura_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_siguiente_lectura_ultima_lectura_id ON public.siguiente_lectura USING btree (ultima_lectura_id);


--
-- TOC entry 9000 (class 1259 OID 189720)
-- Name: idx_tarifa_categoria_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tarifa_categoria_id ON public.tarifa USING btree (categoria_id);


--
-- TOC entry 9001 (class 1259 OID 189721)
-- Name: idx_tarifa_effective_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tarifa_effective_date ON public.tarifa USING btree (effective_date, categoria_id);


--
-- TOC entry 8764 (class 1259 OID 189722)
-- Name: idx_telefono_cliente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_telefono_cliente_id ON public.telefono USING btree (cliente_id);


--
-- TOC entry 9004 (class 1259 OID 189723)
-- Name: idx_telefono_empresa_empresa_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_telefono_empresa_empresa_id ON public.telefono_empresa USING btree (empresa_id);


--
-- TOC entry 9005 (class 1259 OID 189724)
-- Name: idx_telefono_empresa_telefono_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_telefono_empresa_telefono_id ON public.telefono_empresa USING btree (telefono_id);


--
-- TOC entry 8765 (class 1259 OID 189725)
-- Name: idx_telefono_numero; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_telefono_numero ON public.telefono USING btree (numero);


--
-- TOC entry 9008 (class 1259 OID 189726)
-- Name: idx_telefono_persona_natural_cliente_persona_natural_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_telefono_persona_natural_cliente_persona_natural_id ON public.telefono_persona_natural USING btree (cliente_persona_natural_id);


--
-- TOC entry 9009 (class 1259 OID 189727)
-- Name: idx_telefono_persona_natural_telefono_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_telefono_persona_natural_telefono_id ON public.telefono_persona_natural USING btree (telefono_id);


--
-- TOC entry 8766 (class 1259 OID 189728)
-- Name: idx_telefono_tipo_telefono_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_telefono_tipo_telefono_id ON public.telefono USING btree (tipo_telefono_id);


--
-- TOC entry 9016 (class 1259 OID 189729)
-- Name: idx_tipo_estado_lectura_codigo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tipo_estado_lectura_codigo ON public.tipo_estado_lectura USING btree (codigo);


--
-- TOC entry 9017 (class 1259 OID 189730)
-- Name: idx_tipo_estado_lectura_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tipo_estado_lectura_nombre ON public.tipo_estado_lectura USING btree (nombre);


--
-- TOC entry 9024 (class 1259 OID 189731)
-- Name: idx_tipo_identificacion_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tipo_identificacion_nombre ON public.tipo_identificacion USING btree (nombre);


--
-- TOC entry 9027 (class 1259 OID 189732)
-- Name: idx_tipo_novedad_lectura_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tipo_novedad_lectura_nombre ON public.tipo_novedad_lectura USING btree (nombre);


--
-- TOC entry 9032 (class 1259 OID 189733)
-- Name: idx_tipo_parroquia_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tipo_parroquia_nombre ON public.tipo_parroquia USING btree (nombre);


--
-- TOC entry 9039 (class 1259 OID 189734)
-- Name: idx_tipo_relacion_familiar_parentesco; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tipo_relacion_familiar_parentesco ON public.tipo_relacion_familiar USING btree (parentesco);


--
-- TOC entry 9042 (class 1259 OID 189735)
-- Name: idx_tipo_telefono_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tipo_telefono_nombre ON public.tipo_telefono USING btree (nombre);


--
-- TOC entry 9045 (class 1259 OID 189736)
-- Name: idx_tipo_titulo_dato_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tipo_titulo_dato_nombre ON public.tipo_titulo_dato USING btree (nombre);


--
-- TOC entry 9048 (class 1259 OID 189737)
-- Name: idx_titulo_dato_cliente_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_titulo_dato_cliente_id ON public.titulo_dato USING btree (cliente_id);


--
-- TOC entry 9049 (class 1259 OID 189738)
-- Name: idx_titulo_dato_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_titulo_dato_estado ON public.titulo_dato USING btree (estado);


--
-- TOC entry 9050 (class 1259 OID 189739)
-- Name: idx_titulo_dato_fecha_emision; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_titulo_dato_fecha_emision ON public.titulo_dato USING btree (fecha_emision);


--
-- TOC entry 9051 (class 1259 OID 189740)
-- Name: idx_titulo_dato_fecha_vencimiento; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_titulo_dato_fecha_vencimiento ON public.titulo_dato USING btree (fecha_vencimiento);


--
-- TOC entry 9052 (class 1259 OID 189741)
-- Name: idx_titulo_dato_tipo_titulo_dato_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_titulo_dato_tipo_titulo_dato_id ON public.titulo_dato USING btree (tipo_titulo_dato_id);


--
-- TOC entry 9055 (class 1259 OID 189742)
-- Name: idx_usuario_factura_factura_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_factura_factura_id ON public.usuario_factura USING btree (factura_id);


--
-- TOC entry 9056 (class 1259 OID 189743)
-- Name: idx_usuario_factura_fecha_registro; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_factura_fecha_registro ON public.usuario_factura USING btree (fecha_registro);


--
-- TOC entry 9057 (class 1259 OID 189744)
-- Name: idx_usuario_factura_usuario_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_factura_usuario_id ON public.usuario_factura USING btree (usuario_id);


--
-- TOC entry 9060 (class 1259 OID 189745)
-- Name: idx_usuario_lectura_lectura_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_lectura_lectura_id ON public.usuario_lectura USING btree (lectura_id);


--
-- TOC entry 9061 (class 1259 OID 189746)
-- Name: idx_usuario_lectura_usuario_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_lectura_usuario_id ON public.usuario_lectura USING btree (usuario_id);


--
-- TOC entry 9064 (class 1259 OID 189747)
-- Name: idx_usuario_permisos_permiso_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_permisos_permiso_id ON public.usuario_permisos USING btree (permiso_id);


--
-- TOC entry 9065 (class 1259 OID 189748)
-- Name: idx_usuario_permisos_usuario_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_permisos_usuario_id ON public.usuario_permisos USING btree (usuario_id);


--
-- TOC entry 9070 (class 1259 OID 189749)
-- Name: idx_usuario_roles_rol_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_roles_rol_id ON public.usuario_roles USING btree (rol_id);


--
-- TOC entry 9071 (class 1259 OID 189750)
-- Name: idx_usuario_roles_usuario_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_roles_usuario_id ON public.usuario_roles USING btree (usuario_id);


--
-- TOC entry 8218 (class 1259 OID 189751)
-- Name: idx_usuarios_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuarios_email ON public.usuarios USING btree (email);


--
-- TOC entry 8219 (class 1259 OID 189752)
-- Name: idx_usuarios_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuarios_username ON public.usuarios USING btree (username);


--
-- TOC entry 9076 (class 1259 OID 189753)
-- Name: idx_zona_codigo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_zona_codigo ON public.zona USING btree (codigo);


--
-- TOC entry 9077 (class 1259 OID 189754)
-- Name: idx_zona_nombre; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_zona_nombre ON public.zona USING btree (nombre);


--
-- TOC entry 9084 (class 1259 OID 189755)
-- Name: idx_adjuntos_orden_trabajo; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_adjuntos_orden_trabajo ON work_orders.adjuntos_orden_trabajo USING btree (id_orden_trabajo);


--
-- TOC entry 9089 (class 1259 OID 189756)
-- Name: idx_asignacion_orden_trabajo; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_asignacion_orden_trabajo ON work_orders.asignacion_orden_trabajo_trabajador USING btree (id_orden_trabajo);


--
-- TOC entry 9098 (class 1259 OID 189757)
-- Name: idx_detalle_orden_trabajo_material_orden; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_detalle_orden_trabajo_material_orden ON work_orders.detalle_orden_trabajo_material USING btree (id_orden_trabajo);


--
-- TOC entry 9101 (class 1259 OID 189758)
-- Name: idx_detalle_prioridad_detalle; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_detalle_prioridad_detalle ON work_orders.detalle_prioridad USING btree (detalle);


--
-- TOC entry 9102 (class 1259 OID 189759)
-- Name: idx_detalle_prioridad_prioridad; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_detalle_prioridad_prioridad ON work_orders.detalle_prioridad USING btree (id_prioridad);


--
-- TOC entry 9105 (class 1259 OID 189760)
-- Name: idx_detalle_tipo_trabajo_detalle; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_detalle_tipo_trabajo_detalle ON work_orders.detalle_tipo_trabajo USING btree (detalle);


--
-- TOC entry 9106 (class 1259 OID 189761)
-- Name: idx_detalle_tipo_trabajo_tipo; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_detalle_tipo_trabajo_tipo ON work_orders.detalle_tipo_trabajo USING btree (id_tipo_trabajo);


--
-- TOC entry 9111 (class 1259 OID 189762)
-- Name: idx_estado_orden_trabajo_nombre; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_estado_orden_trabajo_nombre ON work_orders.estado_orden_trabajo USING btree (nombre_estado);


--
-- TOC entry 9114 (class 1259 OID 189763)
-- Name: idx_historial_estado_orden_trabajo_orden; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_historial_estado_orden_trabajo_orden ON work_orders.historial_estado_orden_trabajo USING btree (id_orden_trabajo);


--
-- TOC entry 9115 (class 1259 OID 189764)
-- Name: idx_observaciones_orden_trabajo; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_observaciones_orden_trabajo ON work_orders.observaciones_orden_trabajo USING btree (id_orden_trabajo);


--
-- TOC entry 9118 (class 1259 OID 189765)
-- Name: idx_orden_trabajo_cliente; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_orden_trabajo_cliente ON work_orders.orden_trabajo USING btree (id_cliente);


--
-- TOC entry 9119 (class 1259 OID 189766)
-- Name: idx_orden_trabajo_codigo_orden; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE UNIQUE INDEX idx_orden_trabajo_codigo_orden ON work_orders.orden_trabajo USING btree (codigo_orden) WHERE (is_deleted = false);


--
-- TOC entry 9120 (class 1259 OID 189767)
-- Name: idx_orden_trabajo_coordenadas; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_orden_trabajo_coordenadas ON work_orders.orden_trabajo USING gist (coordenadas);


--
-- TOC entry 9121 (class 1259 OID 189768)
-- Name: idx_orden_trabajo_estado; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_orden_trabajo_estado ON work_orders.orden_trabajo USING btree (estado);


--
-- TOC entry 9122 (class 1259 OID 189769)
-- Name: idx_orden_trabajo_fecha; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_orden_trabajo_fecha ON work_orders.orden_trabajo USING btree (fecha_creacion);


--
-- TOC entry 9123 (class 1259 OID 189770)
-- Name: idx_orden_trabajo_metadata; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_orden_trabajo_metadata ON work_orders.orden_trabajo USING gin (metadata);


--
-- TOC entry 9124 (class 1259 OID 189771)
-- Name: idx_orden_trabajo_secuencial; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE UNIQUE INDEX idx_orden_trabajo_secuencial ON work_orders.orden_trabajo USING btree (numero_secuencial);


--
-- TOC entry 9129 (class 1259 OID 189772)
-- Name: idx_prioridad_nivel; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_prioridad_nivel ON work_orders.prioridad_orden_trabajo USING btree (nivel);


--
-- TOC entry 9134 (class 1259 OID 189773)
-- Name: idx_rol_trabajador_nombre; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_rol_trabajador_nombre ON work_orders.rol_trabajador USING btree (nombre);


--
-- TOC entry 9139 (class 1259 OID 189774)
-- Name: idx_tipo_trabajo_nombre; Type: INDEX; Schema: work_orders; Owner: -
--

CREATE INDEX idx_tipo_trabajo_nombre ON work_orders.tipo_trabajo USING btree (nombre);


--
-- TOC entry 9158 (class 0 OID 0)
-- Name: registro_2024_01_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_01_audit_timestamp_idx;


--
-- TOC entry 9159 (class 0 OID 0)
-- Name: registro_2024_01_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_01_diff_jsonb_idx;


--
-- TOC entry 9160 (class 0 OID 0)
-- Name: registro_2024_01_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_01_operacion_audit_timestamp_idx;


--
-- TOC entry 9161 (class 0 OID 0)
-- Name: registro_2024_01_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_01_pk_valor_idx;


--
-- TOC entry 9162 (class 0 OID 0)
-- Name: registro_2024_01_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_01_pkey;


--
-- TOC entry 9163 (class 0 OID 0)
-- Name: registro_2024_01_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_01_sesion_id_idx;


--
-- TOC entry 9164 (class 0 OID 0)
-- Name: registro_2024_01_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_01_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9165 (class 0 OID 0)
-- Name: registro_2024_01_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_01_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9166 (class 0 OID 0)
-- Name: registro_2024_02_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_02_audit_timestamp_idx;


--
-- TOC entry 9167 (class 0 OID 0)
-- Name: registro_2024_02_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_02_diff_jsonb_idx;


--
-- TOC entry 9168 (class 0 OID 0)
-- Name: registro_2024_02_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_02_operacion_audit_timestamp_idx;


--
-- TOC entry 9169 (class 0 OID 0)
-- Name: registro_2024_02_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_02_pk_valor_idx;


--
-- TOC entry 9170 (class 0 OID 0)
-- Name: registro_2024_02_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_02_pkey;


--
-- TOC entry 9171 (class 0 OID 0)
-- Name: registro_2024_02_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_02_sesion_id_idx;


--
-- TOC entry 9172 (class 0 OID 0)
-- Name: registro_2024_02_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_02_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9173 (class 0 OID 0)
-- Name: registro_2024_02_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_02_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9174 (class 0 OID 0)
-- Name: registro_2024_03_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_03_audit_timestamp_idx;


--
-- TOC entry 9175 (class 0 OID 0)
-- Name: registro_2024_03_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_03_diff_jsonb_idx;


--
-- TOC entry 9176 (class 0 OID 0)
-- Name: registro_2024_03_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_03_operacion_audit_timestamp_idx;


--
-- TOC entry 9177 (class 0 OID 0)
-- Name: registro_2024_03_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_03_pk_valor_idx;


--
-- TOC entry 9178 (class 0 OID 0)
-- Name: registro_2024_03_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_03_pkey;


--
-- TOC entry 9179 (class 0 OID 0)
-- Name: registro_2024_03_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_03_sesion_id_idx;


--
-- TOC entry 9180 (class 0 OID 0)
-- Name: registro_2024_03_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_03_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9181 (class 0 OID 0)
-- Name: registro_2024_03_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_03_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9182 (class 0 OID 0)
-- Name: registro_2024_04_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_04_audit_timestamp_idx;


--
-- TOC entry 9183 (class 0 OID 0)
-- Name: registro_2024_04_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_04_diff_jsonb_idx;


--
-- TOC entry 9184 (class 0 OID 0)
-- Name: registro_2024_04_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_04_operacion_audit_timestamp_idx;


--
-- TOC entry 9185 (class 0 OID 0)
-- Name: registro_2024_04_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_04_pk_valor_idx;


--
-- TOC entry 9186 (class 0 OID 0)
-- Name: registro_2024_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_04_pkey;


--
-- TOC entry 9187 (class 0 OID 0)
-- Name: registro_2024_04_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_04_sesion_id_idx;


--
-- TOC entry 9188 (class 0 OID 0)
-- Name: registro_2024_04_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_04_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9189 (class 0 OID 0)
-- Name: registro_2024_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_04_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9190 (class 0 OID 0)
-- Name: registro_2024_05_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_05_audit_timestamp_idx;


--
-- TOC entry 9191 (class 0 OID 0)
-- Name: registro_2024_05_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_05_diff_jsonb_idx;


--
-- TOC entry 9192 (class 0 OID 0)
-- Name: registro_2024_05_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_05_operacion_audit_timestamp_idx;


--
-- TOC entry 9193 (class 0 OID 0)
-- Name: registro_2024_05_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_05_pk_valor_idx;


--
-- TOC entry 9194 (class 0 OID 0)
-- Name: registro_2024_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_05_pkey;


--
-- TOC entry 9195 (class 0 OID 0)
-- Name: registro_2024_05_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_05_sesion_id_idx;


--
-- TOC entry 9196 (class 0 OID 0)
-- Name: registro_2024_05_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_05_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9197 (class 0 OID 0)
-- Name: registro_2024_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_05_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9198 (class 0 OID 0)
-- Name: registro_2024_06_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_06_audit_timestamp_idx;


--
-- TOC entry 9199 (class 0 OID 0)
-- Name: registro_2024_06_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_06_diff_jsonb_idx;


--
-- TOC entry 9200 (class 0 OID 0)
-- Name: registro_2024_06_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_06_operacion_audit_timestamp_idx;


--
-- TOC entry 9201 (class 0 OID 0)
-- Name: registro_2024_06_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_06_pk_valor_idx;


--
-- TOC entry 9202 (class 0 OID 0)
-- Name: registro_2024_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_06_pkey;


--
-- TOC entry 9203 (class 0 OID 0)
-- Name: registro_2024_06_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_06_sesion_id_idx;


--
-- TOC entry 9204 (class 0 OID 0)
-- Name: registro_2024_06_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_06_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9205 (class 0 OID 0)
-- Name: registro_2024_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_06_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9206 (class 0 OID 0)
-- Name: registro_2024_07_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_07_audit_timestamp_idx;


--
-- TOC entry 9207 (class 0 OID 0)
-- Name: registro_2024_07_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_07_diff_jsonb_idx;


--
-- TOC entry 9208 (class 0 OID 0)
-- Name: registro_2024_07_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_07_operacion_audit_timestamp_idx;


--
-- TOC entry 9209 (class 0 OID 0)
-- Name: registro_2024_07_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_07_pk_valor_idx;


--
-- TOC entry 9210 (class 0 OID 0)
-- Name: registro_2024_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_07_pkey;


--
-- TOC entry 9211 (class 0 OID 0)
-- Name: registro_2024_07_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_07_sesion_id_idx;


--
-- TOC entry 9212 (class 0 OID 0)
-- Name: registro_2024_07_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_07_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9213 (class 0 OID 0)
-- Name: registro_2024_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_07_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9214 (class 0 OID 0)
-- Name: registro_2024_08_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_08_audit_timestamp_idx;


--
-- TOC entry 9215 (class 0 OID 0)
-- Name: registro_2024_08_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_08_diff_jsonb_idx;


--
-- TOC entry 9216 (class 0 OID 0)
-- Name: registro_2024_08_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_08_operacion_audit_timestamp_idx;


--
-- TOC entry 9217 (class 0 OID 0)
-- Name: registro_2024_08_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_08_pk_valor_idx;


--
-- TOC entry 9218 (class 0 OID 0)
-- Name: registro_2024_08_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_08_pkey;


--
-- TOC entry 9219 (class 0 OID 0)
-- Name: registro_2024_08_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_08_sesion_id_idx;


--
-- TOC entry 9220 (class 0 OID 0)
-- Name: registro_2024_08_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_08_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9221 (class 0 OID 0)
-- Name: registro_2024_08_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_08_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9222 (class 0 OID 0)
-- Name: registro_2024_09_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_09_audit_timestamp_idx;


--
-- TOC entry 9223 (class 0 OID 0)
-- Name: registro_2024_09_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_09_diff_jsonb_idx;


--
-- TOC entry 9224 (class 0 OID 0)
-- Name: registro_2024_09_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_09_operacion_audit_timestamp_idx;


--
-- TOC entry 9225 (class 0 OID 0)
-- Name: registro_2024_09_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_09_pk_valor_idx;


--
-- TOC entry 9226 (class 0 OID 0)
-- Name: registro_2024_09_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_09_pkey;


--
-- TOC entry 9227 (class 0 OID 0)
-- Name: registro_2024_09_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_09_sesion_id_idx;


--
-- TOC entry 9228 (class 0 OID 0)
-- Name: registro_2024_09_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_09_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9229 (class 0 OID 0)
-- Name: registro_2024_09_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_09_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9230 (class 0 OID 0)
-- Name: registro_2024_10_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_10_audit_timestamp_idx;


--
-- TOC entry 9231 (class 0 OID 0)
-- Name: registro_2024_10_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_10_diff_jsonb_idx;


--
-- TOC entry 9232 (class 0 OID 0)
-- Name: registro_2024_10_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_10_operacion_audit_timestamp_idx;


--
-- TOC entry 9233 (class 0 OID 0)
-- Name: registro_2024_10_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_10_pk_valor_idx;


--
-- TOC entry 9234 (class 0 OID 0)
-- Name: registro_2024_10_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_10_pkey;


--
-- TOC entry 9235 (class 0 OID 0)
-- Name: registro_2024_10_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_10_sesion_id_idx;


--
-- TOC entry 9236 (class 0 OID 0)
-- Name: registro_2024_10_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_10_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9237 (class 0 OID 0)
-- Name: registro_2024_10_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_10_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9238 (class 0 OID 0)
-- Name: registro_2024_11_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_11_audit_timestamp_idx;


--
-- TOC entry 9239 (class 0 OID 0)
-- Name: registro_2024_11_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_11_diff_jsonb_idx;


--
-- TOC entry 9240 (class 0 OID 0)
-- Name: registro_2024_11_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_11_operacion_audit_timestamp_idx;


--
-- TOC entry 9241 (class 0 OID 0)
-- Name: registro_2024_11_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_11_pk_valor_idx;


--
-- TOC entry 9242 (class 0 OID 0)
-- Name: registro_2024_11_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_11_pkey;


--
-- TOC entry 9243 (class 0 OID 0)
-- Name: registro_2024_11_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_11_sesion_id_idx;


--
-- TOC entry 9244 (class 0 OID 0)
-- Name: registro_2024_11_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_11_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9245 (class 0 OID 0)
-- Name: registro_2024_11_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_11_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9246 (class 0 OID 0)
-- Name: registro_2024_12_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2024_12_audit_timestamp_idx;


--
-- TOC entry 9247 (class 0 OID 0)
-- Name: registro_2024_12_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2024_12_diff_jsonb_idx;


--
-- TOC entry 9248 (class 0 OID 0)
-- Name: registro_2024_12_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2024_12_operacion_audit_timestamp_idx;


--
-- TOC entry 9249 (class 0 OID 0)
-- Name: registro_2024_12_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2024_12_pk_valor_idx;


--
-- TOC entry 9250 (class 0 OID 0)
-- Name: registro_2024_12_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2024_12_pkey;


--
-- TOC entry 9251 (class 0 OID 0)
-- Name: registro_2024_12_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2024_12_sesion_id_idx;


--
-- TOC entry 9252 (class 0 OID 0)
-- Name: registro_2024_12_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2024_12_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9253 (class 0 OID 0)
-- Name: registro_2024_12_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2024_12_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9254 (class 0 OID 0)
-- Name: registro_2025_01_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_01_audit_timestamp_idx;


--
-- TOC entry 9255 (class 0 OID 0)
-- Name: registro_2025_01_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_01_diff_jsonb_idx;


--
-- TOC entry 9256 (class 0 OID 0)
-- Name: registro_2025_01_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_01_operacion_audit_timestamp_idx;


--
-- TOC entry 9257 (class 0 OID 0)
-- Name: registro_2025_01_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_01_pk_valor_idx;


--
-- TOC entry 9258 (class 0 OID 0)
-- Name: registro_2025_01_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_01_pkey;


--
-- TOC entry 9259 (class 0 OID 0)
-- Name: registro_2025_01_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_01_sesion_id_idx;


--
-- TOC entry 9260 (class 0 OID 0)
-- Name: registro_2025_01_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_01_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9261 (class 0 OID 0)
-- Name: registro_2025_01_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_01_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9262 (class 0 OID 0)
-- Name: registro_2025_02_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_02_audit_timestamp_idx;


--
-- TOC entry 9263 (class 0 OID 0)
-- Name: registro_2025_02_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_02_diff_jsonb_idx;


--
-- TOC entry 9264 (class 0 OID 0)
-- Name: registro_2025_02_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_02_operacion_audit_timestamp_idx;


--
-- TOC entry 9265 (class 0 OID 0)
-- Name: registro_2025_02_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_02_pk_valor_idx;


--
-- TOC entry 9266 (class 0 OID 0)
-- Name: registro_2025_02_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_02_pkey;


--
-- TOC entry 9267 (class 0 OID 0)
-- Name: registro_2025_02_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_02_sesion_id_idx;


--
-- TOC entry 9268 (class 0 OID 0)
-- Name: registro_2025_02_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_02_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9269 (class 0 OID 0)
-- Name: registro_2025_02_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_02_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9270 (class 0 OID 0)
-- Name: registro_2025_03_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_03_audit_timestamp_idx;


--
-- TOC entry 9271 (class 0 OID 0)
-- Name: registro_2025_03_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_03_diff_jsonb_idx;


--
-- TOC entry 9272 (class 0 OID 0)
-- Name: registro_2025_03_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_03_operacion_audit_timestamp_idx;


--
-- TOC entry 9273 (class 0 OID 0)
-- Name: registro_2025_03_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_03_pk_valor_idx;


--
-- TOC entry 9274 (class 0 OID 0)
-- Name: registro_2025_03_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_03_pkey;


--
-- TOC entry 9275 (class 0 OID 0)
-- Name: registro_2025_03_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_03_sesion_id_idx;


--
-- TOC entry 9276 (class 0 OID 0)
-- Name: registro_2025_03_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_03_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9277 (class 0 OID 0)
-- Name: registro_2025_03_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_03_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9278 (class 0 OID 0)
-- Name: registro_2025_04_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_04_audit_timestamp_idx;


--
-- TOC entry 9279 (class 0 OID 0)
-- Name: registro_2025_04_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_04_diff_jsonb_idx;


--
-- TOC entry 9280 (class 0 OID 0)
-- Name: registro_2025_04_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_04_operacion_audit_timestamp_idx;


--
-- TOC entry 9281 (class 0 OID 0)
-- Name: registro_2025_04_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_04_pk_valor_idx;


--
-- TOC entry 9282 (class 0 OID 0)
-- Name: registro_2025_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_04_pkey;


--
-- TOC entry 9283 (class 0 OID 0)
-- Name: registro_2025_04_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_04_sesion_id_idx;


--
-- TOC entry 9284 (class 0 OID 0)
-- Name: registro_2025_04_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_04_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9285 (class 0 OID 0)
-- Name: registro_2025_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_04_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9286 (class 0 OID 0)
-- Name: registro_2025_05_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_05_audit_timestamp_idx;


--
-- TOC entry 9287 (class 0 OID 0)
-- Name: registro_2025_05_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_05_diff_jsonb_idx;


--
-- TOC entry 9288 (class 0 OID 0)
-- Name: registro_2025_05_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_05_operacion_audit_timestamp_idx;


--
-- TOC entry 9289 (class 0 OID 0)
-- Name: registro_2025_05_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_05_pk_valor_idx;


--
-- TOC entry 9290 (class 0 OID 0)
-- Name: registro_2025_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_05_pkey;


--
-- TOC entry 9291 (class 0 OID 0)
-- Name: registro_2025_05_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_05_sesion_id_idx;


--
-- TOC entry 9292 (class 0 OID 0)
-- Name: registro_2025_05_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_05_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9293 (class 0 OID 0)
-- Name: registro_2025_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_05_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9294 (class 0 OID 0)
-- Name: registro_2025_06_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_06_audit_timestamp_idx;


--
-- TOC entry 9295 (class 0 OID 0)
-- Name: registro_2025_06_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_06_diff_jsonb_idx;


--
-- TOC entry 9296 (class 0 OID 0)
-- Name: registro_2025_06_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_06_operacion_audit_timestamp_idx;


--
-- TOC entry 9297 (class 0 OID 0)
-- Name: registro_2025_06_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_06_pk_valor_idx;


--
-- TOC entry 9298 (class 0 OID 0)
-- Name: registro_2025_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_06_pkey;


--
-- TOC entry 9299 (class 0 OID 0)
-- Name: registro_2025_06_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_06_sesion_id_idx;


--
-- TOC entry 9300 (class 0 OID 0)
-- Name: registro_2025_06_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_06_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9301 (class 0 OID 0)
-- Name: registro_2025_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_06_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9302 (class 0 OID 0)
-- Name: registro_2025_07_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_07_audit_timestamp_idx;


--
-- TOC entry 9303 (class 0 OID 0)
-- Name: registro_2025_07_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_07_diff_jsonb_idx;


--
-- TOC entry 9304 (class 0 OID 0)
-- Name: registro_2025_07_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_07_operacion_audit_timestamp_idx;


--
-- TOC entry 9305 (class 0 OID 0)
-- Name: registro_2025_07_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_07_pk_valor_idx;


--
-- TOC entry 9306 (class 0 OID 0)
-- Name: registro_2025_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_07_pkey;


--
-- TOC entry 9307 (class 0 OID 0)
-- Name: registro_2025_07_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_07_sesion_id_idx;


--
-- TOC entry 9308 (class 0 OID 0)
-- Name: registro_2025_07_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_07_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9309 (class 0 OID 0)
-- Name: registro_2025_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_07_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9310 (class 0 OID 0)
-- Name: registro_2025_08_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_08_audit_timestamp_idx;


--
-- TOC entry 9311 (class 0 OID 0)
-- Name: registro_2025_08_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_08_diff_jsonb_idx;


--
-- TOC entry 9312 (class 0 OID 0)
-- Name: registro_2025_08_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_08_operacion_audit_timestamp_idx;


--
-- TOC entry 9313 (class 0 OID 0)
-- Name: registro_2025_08_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_08_pk_valor_idx;


--
-- TOC entry 9314 (class 0 OID 0)
-- Name: registro_2025_08_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_08_pkey;


--
-- TOC entry 9315 (class 0 OID 0)
-- Name: registro_2025_08_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_08_sesion_id_idx;


--
-- TOC entry 9316 (class 0 OID 0)
-- Name: registro_2025_08_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_08_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9317 (class 0 OID 0)
-- Name: registro_2025_08_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_08_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9318 (class 0 OID 0)
-- Name: registro_2025_09_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_09_audit_timestamp_idx;


--
-- TOC entry 9319 (class 0 OID 0)
-- Name: registro_2025_09_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_09_diff_jsonb_idx;


--
-- TOC entry 9320 (class 0 OID 0)
-- Name: registro_2025_09_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_09_operacion_audit_timestamp_idx;


--
-- TOC entry 9321 (class 0 OID 0)
-- Name: registro_2025_09_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_09_pk_valor_idx;


--
-- TOC entry 9322 (class 0 OID 0)
-- Name: registro_2025_09_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_09_pkey;


--
-- TOC entry 9323 (class 0 OID 0)
-- Name: registro_2025_09_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_09_sesion_id_idx;


--
-- TOC entry 9324 (class 0 OID 0)
-- Name: registro_2025_09_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_09_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9325 (class 0 OID 0)
-- Name: registro_2025_09_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_09_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9326 (class 0 OID 0)
-- Name: registro_2025_10_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_10_audit_timestamp_idx;


--
-- TOC entry 9327 (class 0 OID 0)
-- Name: registro_2025_10_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_10_diff_jsonb_idx;


--
-- TOC entry 9328 (class 0 OID 0)
-- Name: registro_2025_10_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_10_operacion_audit_timestamp_idx;


--
-- TOC entry 9329 (class 0 OID 0)
-- Name: registro_2025_10_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_10_pk_valor_idx;


--
-- TOC entry 9330 (class 0 OID 0)
-- Name: registro_2025_10_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_10_pkey;


--
-- TOC entry 9331 (class 0 OID 0)
-- Name: registro_2025_10_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_10_sesion_id_idx;


--
-- TOC entry 9332 (class 0 OID 0)
-- Name: registro_2025_10_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_10_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9333 (class 0 OID 0)
-- Name: registro_2025_10_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_10_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9334 (class 0 OID 0)
-- Name: registro_2025_11_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_11_audit_timestamp_idx;


--
-- TOC entry 9335 (class 0 OID 0)
-- Name: registro_2025_11_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_11_diff_jsonb_idx;


--
-- TOC entry 9336 (class 0 OID 0)
-- Name: registro_2025_11_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_11_operacion_audit_timestamp_idx;


--
-- TOC entry 9337 (class 0 OID 0)
-- Name: registro_2025_11_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_11_pk_valor_idx;


--
-- TOC entry 9338 (class 0 OID 0)
-- Name: registro_2025_11_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_11_pkey;


--
-- TOC entry 9339 (class 0 OID 0)
-- Name: registro_2025_11_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_11_sesion_id_idx;


--
-- TOC entry 9340 (class 0 OID 0)
-- Name: registro_2025_11_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_11_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9341 (class 0 OID 0)
-- Name: registro_2025_11_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_11_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9342 (class 0 OID 0)
-- Name: registro_2025_12_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2025_12_audit_timestamp_idx;


--
-- TOC entry 9343 (class 0 OID 0)
-- Name: registro_2025_12_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2025_12_diff_jsonb_idx;


--
-- TOC entry 9344 (class 0 OID 0)
-- Name: registro_2025_12_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2025_12_operacion_audit_timestamp_idx;


--
-- TOC entry 9345 (class 0 OID 0)
-- Name: registro_2025_12_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2025_12_pk_valor_idx;


--
-- TOC entry 9346 (class 0 OID 0)
-- Name: registro_2025_12_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2025_12_pkey;


--
-- TOC entry 9347 (class 0 OID 0)
-- Name: registro_2025_12_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2025_12_sesion_id_idx;


--
-- TOC entry 9348 (class 0 OID 0)
-- Name: registro_2025_12_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2025_12_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9349 (class 0 OID 0)
-- Name: registro_2025_12_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2025_12_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9350 (class 0 OID 0)
-- Name: registro_2026_01_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_01_audit_timestamp_idx;


--
-- TOC entry 9351 (class 0 OID 0)
-- Name: registro_2026_01_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_01_diff_jsonb_idx;


--
-- TOC entry 9352 (class 0 OID 0)
-- Name: registro_2026_01_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_01_operacion_audit_timestamp_idx;


--
-- TOC entry 9353 (class 0 OID 0)
-- Name: registro_2026_01_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_01_pk_valor_idx;


--
-- TOC entry 9354 (class 0 OID 0)
-- Name: registro_2026_01_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_01_pkey;


--
-- TOC entry 9355 (class 0 OID 0)
-- Name: registro_2026_01_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_01_sesion_id_idx;


--
-- TOC entry 9356 (class 0 OID 0)
-- Name: registro_2026_01_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_01_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9357 (class 0 OID 0)
-- Name: registro_2026_01_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_01_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9358 (class 0 OID 0)
-- Name: registro_2026_02_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_02_audit_timestamp_idx;


--
-- TOC entry 9359 (class 0 OID 0)
-- Name: registro_2026_02_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_02_diff_jsonb_idx;


--
-- TOC entry 9360 (class 0 OID 0)
-- Name: registro_2026_02_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_02_operacion_audit_timestamp_idx;


--
-- TOC entry 9361 (class 0 OID 0)
-- Name: registro_2026_02_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_02_pk_valor_idx;


--
-- TOC entry 9362 (class 0 OID 0)
-- Name: registro_2026_02_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_02_pkey;


--
-- TOC entry 9363 (class 0 OID 0)
-- Name: registro_2026_02_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_02_sesion_id_idx;


--
-- TOC entry 9364 (class 0 OID 0)
-- Name: registro_2026_02_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_02_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9365 (class 0 OID 0)
-- Name: registro_2026_02_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_02_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9366 (class 0 OID 0)
-- Name: registro_2026_03_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_03_audit_timestamp_idx;


--
-- TOC entry 9367 (class 0 OID 0)
-- Name: registro_2026_03_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_03_diff_jsonb_idx;


--
-- TOC entry 9368 (class 0 OID 0)
-- Name: registro_2026_03_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_03_operacion_audit_timestamp_idx;


--
-- TOC entry 9369 (class 0 OID 0)
-- Name: registro_2026_03_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_03_pk_valor_idx;


--
-- TOC entry 9370 (class 0 OID 0)
-- Name: registro_2026_03_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_03_pkey;


--
-- TOC entry 9371 (class 0 OID 0)
-- Name: registro_2026_03_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_03_sesion_id_idx;


--
-- TOC entry 9372 (class 0 OID 0)
-- Name: registro_2026_03_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_03_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9373 (class 0 OID 0)
-- Name: registro_2026_03_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_03_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9374 (class 0 OID 0)
-- Name: registro_2026_04_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_04_audit_timestamp_idx;


--
-- TOC entry 9375 (class 0 OID 0)
-- Name: registro_2026_04_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_04_diff_jsonb_idx;


--
-- TOC entry 9376 (class 0 OID 0)
-- Name: registro_2026_04_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_04_operacion_audit_timestamp_idx;


--
-- TOC entry 9377 (class 0 OID 0)
-- Name: registro_2026_04_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_04_pk_valor_idx;


--
-- TOC entry 9378 (class 0 OID 0)
-- Name: registro_2026_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_04_pkey;


--
-- TOC entry 9379 (class 0 OID 0)
-- Name: registro_2026_04_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_04_sesion_id_idx;


--
-- TOC entry 9380 (class 0 OID 0)
-- Name: registro_2026_04_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_04_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9381 (class 0 OID 0)
-- Name: registro_2026_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_04_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9382 (class 0 OID 0)
-- Name: registro_2026_05_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_05_audit_timestamp_idx;


--
-- TOC entry 9383 (class 0 OID 0)
-- Name: registro_2026_05_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_05_diff_jsonb_idx;


--
-- TOC entry 9384 (class 0 OID 0)
-- Name: registro_2026_05_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_05_operacion_audit_timestamp_idx;


--
-- TOC entry 9385 (class 0 OID 0)
-- Name: registro_2026_05_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_05_pk_valor_idx;


--
-- TOC entry 9386 (class 0 OID 0)
-- Name: registro_2026_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_05_pkey;


--
-- TOC entry 9387 (class 0 OID 0)
-- Name: registro_2026_05_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_05_sesion_id_idx;


--
-- TOC entry 9388 (class 0 OID 0)
-- Name: registro_2026_05_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_05_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9389 (class 0 OID 0)
-- Name: registro_2026_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_05_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9390 (class 0 OID 0)
-- Name: registro_2026_06_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_06_audit_timestamp_idx;


--
-- TOC entry 9391 (class 0 OID 0)
-- Name: registro_2026_06_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_06_diff_jsonb_idx;


--
-- TOC entry 9392 (class 0 OID 0)
-- Name: registro_2026_06_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_06_operacion_audit_timestamp_idx;


--
-- TOC entry 9393 (class 0 OID 0)
-- Name: registro_2026_06_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_06_pk_valor_idx;


--
-- TOC entry 9394 (class 0 OID 0)
-- Name: registro_2026_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_06_pkey;


--
-- TOC entry 9395 (class 0 OID 0)
-- Name: registro_2026_06_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_06_sesion_id_idx;


--
-- TOC entry 9396 (class 0 OID 0)
-- Name: registro_2026_06_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_06_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9397 (class 0 OID 0)
-- Name: registro_2026_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_06_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9398 (class 0 OID 0)
-- Name: registro_2026_07_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_07_audit_timestamp_idx;


--
-- TOC entry 9399 (class 0 OID 0)
-- Name: registro_2026_07_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_07_diff_jsonb_idx;


--
-- TOC entry 9400 (class 0 OID 0)
-- Name: registro_2026_07_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_07_operacion_audit_timestamp_idx;


--
-- TOC entry 9401 (class 0 OID 0)
-- Name: registro_2026_07_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_07_pk_valor_idx;


--
-- TOC entry 9402 (class 0 OID 0)
-- Name: registro_2026_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_07_pkey;


--
-- TOC entry 9403 (class 0 OID 0)
-- Name: registro_2026_07_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_07_sesion_id_idx;


--
-- TOC entry 9404 (class 0 OID 0)
-- Name: registro_2026_07_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_07_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9405 (class 0 OID 0)
-- Name: registro_2026_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_07_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9406 (class 0 OID 0)
-- Name: registro_2026_08_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_08_audit_timestamp_idx;


--
-- TOC entry 9407 (class 0 OID 0)
-- Name: registro_2026_08_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_08_diff_jsonb_idx;


--
-- TOC entry 9408 (class 0 OID 0)
-- Name: registro_2026_08_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_08_operacion_audit_timestamp_idx;


--
-- TOC entry 9409 (class 0 OID 0)
-- Name: registro_2026_08_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_08_pk_valor_idx;


--
-- TOC entry 9410 (class 0 OID 0)
-- Name: registro_2026_08_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_08_pkey;


--
-- TOC entry 9411 (class 0 OID 0)
-- Name: registro_2026_08_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_08_sesion_id_idx;


--
-- TOC entry 9412 (class 0 OID 0)
-- Name: registro_2026_08_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_08_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9413 (class 0 OID 0)
-- Name: registro_2026_08_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_08_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9414 (class 0 OID 0)
-- Name: registro_2026_09_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_09_audit_timestamp_idx;


--
-- TOC entry 9415 (class 0 OID 0)
-- Name: registro_2026_09_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_09_diff_jsonb_idx;


--
-- TOC entry 9416 (class 0 OID 0)
-- Name: registro_2026_09_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_09_operacion_audit_timestamp_idx;


--
-- TOC entry 9417 (class 0 OID 0)
-- Name: registro_2026_09_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_09_pk_valor_idx;


--
-- TOC entry 9418 (class 0 OID 0)
-- Name: registro_2026_09_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_09_pkey;


--
-- TOC entry 9419 (class 0 OID 0)
-- Name: registro_2026_09_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_09_sesion_id_idx;


--
-- TOC entry 9420 (class 0 OID 0)
-- Name: registro_2026_09_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_09_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9421 (class 0 OID 0)
-- Name: registro_2026_09_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_09_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9422 (class 0 OID 0)
-- Name: registro_2026_10_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_10_audit_timestamp_idx;


--
-- TOC entry 9423 (class 0 OID 0)
-- Name: registro_2026_10_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_10_diff_jsonb_idx;


--
-- TOC entry 9424 (class 0 OID 0)
-- Name: registro_2026_10_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_10_operacion_audit_timestamp_idx;


--
-- TOC entry 9425 (class 0 OID 0)
-- Name: registro_2026_10_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_10_pk_valor_idx;


--
-- TOC entry 9426 (class 0 OID 0)
-- Name: registro_2026_10_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_10_pkey;


--
-- TOC entry 9427 (class 0 OID 0)
-- Name: registro_2026_10_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_10_sesion_id_idx;


--
-- TOC entry 9428 (class 0 OID 0)
-- Name: registro_2026_10_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_10_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9429 (class 0 OID 0)
-- Name: registro_2026_10_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_10_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9430 (class 0 OID 0)
-- Name: registro_2026_11_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_11_audit_timestamp_idx;


--
-- TOC entry 9431 (class 0 OID 0)
-- Name: registro_2026_11_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_11_diff_jsonb_idx;


--
-- TOC entry 9432 (class 0 OID 0)
-- Name: registro_2026_11_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_11_operacion_audit_timestamp_idx;


--
-- TOC entry 9433 (class 0 OID 0)
-- Name: registro_2026_11_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_11_pk_valor_idx;


--
-- TOC entry 9434 (class 0 OID 0)
-- Name: registro_2026_11_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_11_pkey;


--
-- TOC entry 9435 (class 0 OID 0)
-- Name: registro_2026_11_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_11_sesion_id_idx;


--
-- TOC entry 9436 (class 0 OID 0)
-- Name: registro_2026_11_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_11_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9437 (class 0 OID 0)
-- Name: registro_2026_11_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_11_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9438 (class 0 OID 0)
-- Name: registro_2026_12_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2026_12_audit_timestamp_idx;


--
-- TOC entry 9439 (class 0 OID 0)
-- Name: registro_2026_12_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2026_12_diff_jsonb_idx;


--
-- TOC entry 9440 (class 0 OID 0)
-- Name: registro_2026_12_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2026_12_operacion_audit_timestamp_idx;


--
-- TOC entry 9441 (class 0 OID 0)
-- Name: registro_2026_12_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2026_12_pk_valor_idx;


--
-- TOC entry 9442 (class 0 OID 0)
-- Name: registro_2026_12_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2026_12_pkey;


--
-- TOC entry 9443 (class 0 OID 0)
-- Name: registro_2026_12_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2026_12_sesion_id_idx;


--
-- TOC entry 9444 (class 0 OID 0)
-- Name: registro_2026_12_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2026_12_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9445 (class 0 OID 0)
-- Name: registro_2026_12_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2026_12_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9446 (class 0 OID 0)
-- Name: registro_2027_01_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_01_audit_timestamp_idx;


--
-- TOC entry 9447 (class 0 OID 0)
-- Name: registro_2027_01_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_01_diff_jsonb_idx;


--
-- TOC entry 9448 (class 0 OID 0)
-- Name: registro_2027_01_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_01_operacion_audit_timestamp_idx;


--
-- TOC entry 9449 (class 0 OID 0)
-- Name: registro_2027_01_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_01_pk_valor_idx;


--
-- TOC entry 9450 (class 0 OID 0)
-- Name: registro_2027_01_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_01_pkey;


--
-- TOC entry 9451 (class 0 OID 0)
-- Name: registro_2027_01_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_01_sesion_id_idx;


--
-- TOC entry 9452 (class 0 OID 0)
-- Name: registro_2027_01_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_01_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9453 (class 0 OID 0)
-- Name: registro_2027_01_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_01_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9454 (class 0 OID 0)
-- Name: registro_2027_02_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_02_audit_timestamp_idx;


--
-- TOC entry 9455 (class 0 OID 0)
-- Name: registro_2027_02_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_02_diff_jsonb_idx;


--
-- TOC entry 9456 (class 0 OID 0)
-- Name: registro_2027_02_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_02_operacion_audit_timestamp_idx;


--
-- TOC entry 9457 (class 0 OID 0)
-- Name: registro_2027_02_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_02_pk_valor_idx;


--
-- TOC entry 9458 (class 0 OID 0)
-- Name: registro_2027_02_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_02_pkey;


--
-- TOC entry 9459 (class 0 OID 0)
-- Name: registro_2027_02_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_02_sesion_id_idx;


--
-- TOC entry 9460 (class 0 OID 0)
-- Name: registro_2027_02_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_02_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9461 (class 0 OID 0)
-- Name: registro_2027_02_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_02_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9462 (class 0 OID 0)
-- Name: registro_2027_03_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_03_audit_timestamp_idx;


--
-- TOC entry 9463 (class 0 OID 0)
-- Name: registro_2027_03_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_03_diff_jsonb_idx;


--
-- TOC entry 9464 (class 0 OID 0)
-- Name: registro_2027_03_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_03_operacion_audit_timestamp_idx;


--
-- TOC entry 9465 (class 0 OID 0)
-- Name: registro_2027_03_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_03_pk_valor_idx;


--
-- TOC entry 9466 (class 0 OID 0)
-- Name: registro_2027_03_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_03_pkey;


--
-- TOC entry 9467 (class 0 OID 0)
-- Name: registro_2027_03_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_03_sesion_id_idx;


--
-- TOC entry 9468 (class 0 OID 0)
-- Name: registro_2027_03_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_03_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9469 (class 0 OID 0)
-- Name: registro_2027_03_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_03_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9470 (class 0 OID 0)
-- Name: registro_2027_04_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_04_audit_timestamp_idx;


--
-- TOC entry 9471 (class 0 OID 0)
-- Name: registro_2027_04_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_04_diff_jsonb_idx;


--
-- TOC entry 9472 (class 0 OID 0)
-- Name: registro_2027_04_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_04_operacion_audit_timestamp_idx;


--
-- TOC entry 9473 (class 0 OID 0)
-- Name: registro_2027_04_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_04_pk_valor_idx;


--
-- TOC entry 9474 (class 0 OID 0)
-- Name: registro_2027_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_04_pkey;


--
-- TOC entry 9475 (class 0 OID 0)
-- Name: registro_2027_04_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_04_sesion_id_idx;


--
-- TOC entry 9476 (class 0 OID 0)
-- Name: registro_2027_04_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_04_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9477 (class 0 OID 0)
-- Name: registro_2027_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_04_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9478 (class 0 OID 0)
-- Name: registro_2027_05_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_05_audit_timestamp_idx;


--
-- TOC entry 9479 (class 0 OID 0)
-- Name: registro_2027_05_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_05_diff_jsonb_idx;


--
-- TOC entry 9480 (class 0 OID 0)
-- Name: registro_2027_05_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_05_operacion_audit_timestamp_idx;


--
-- TOC entry 9481 (class 0 OID 0)
-- Name: registro_2027_05_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_05_pk_valor_idx;


--
-- TOC entry 9482 (class 0 OID 0)
-- Name: registro_2027_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_05_pkey;


--
-- TOC entry 9483 (class 0 OID 0)
-- Name: registro_2027_05_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_05_sesion_id_idx;


--
-- TOC entry 9484 (class 0 OID 0)
-- Name: registro_2027_05_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_05_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9485 (class 0 OID 0)
-- Name: registro_2027_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_05_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9486 (class 0 OID 0)
-- Name: registro_2027_06_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_06_audit_timestamp_idx;


--
-- TOC entry 9487 (class 0 OID 0)
-- Name: registro_2027_06_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_06_diff_jsonb_idx;


--
-- TOC entry 9488 (class 0 OID 0)
-- Name: registro_2027_06_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_06_operacion_audit_timestamp_idx;


--
-- TOC entry 9489 (class 0 OID 0)
-- Name: registro_2027_06_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_06_pk_valor_idx;


--
-- TOC entry 9490 (class 0 OID 0)
-- Name: registro_2027_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_06_pkey;


--
-- TOC entry 9491 (class 0 OID 0)
-- Name: registro_2027_06_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_06_sesion_id_idx;


--
-- TOC entry 9492 (class 0 OID 0)
-- Name: registro_2027_06_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_06_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9493 (class 0 OID 0)
-- Name: registro_2027_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_06_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9494 (class 0 OID 0)
-- Name: registro_2027_07_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_07_audit_timestamp_idx;


--
-- TOC entry 9495 (class 0 OID 0)
-- Name: registro_2027_07_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_07_diff_jsonb_idx;


--
-- TOC entry 9496 (class 0 OID 0)
-- Name: registro_2027_07_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_07_operacion_audit_timestamp_idx;


--
-- TOC entry 9497 (class 0 OID 0)
-- Name: registro_2027_07_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_07_pk_valor_idx;


--
-- TOC entry 9498 (class 0 OID 0)
-- Name: registro_2027_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_07_pkey;


--
-- TOC entry 9499 (class 0 OID 0)
-- Name: registro_2027_07_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_07_sesion_id_idx;


--
-- TOC entry 9500 (class 0 OID 0)
-- Name: registro_2027_07_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_07_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9501 (class 0 OID 0)
-- Name: registro_2027_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_07_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9502 (class 0 OID 0)
-- Name: registro_2027_08_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_08_audit_timestamp_idx;


--
-- TOC entry 9503 (class 0 OID 0)
-- Name: registro_2027_08_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_08_diff_jsonb_idx;


--
-- TOC entry 9504 (class 0 OID 0)
-- Name: registro_2027_08_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_08_operacion_audit_timestamp_idx;


--
-- TOC entry 9505 (class 0 OID 0)
-- Name: registro_2027_08_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_08_pk_valor_idx;


--
-- TOC entry 9506 (class 0 OID 0)
-- Name: registro_2027_08_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_08_pkey;


--
-- TOC entry 9507 (class 0 OID 0)
-- Name: registro_2027_08_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_08_sesion_id_idx;


--
-- TOC entry 9508 (class 0 OID 0)
-- Name: registro_2027_08_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_08_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9509 (class 0 OID 0)
-- Name: registro_2027_08_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_08_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9510 (class 0 OID 0)
-- Name: registro_2027_09_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_09_audit_timestamp_idx;


--
-- TOC entry 9511 (class 0 OID 0)
-- Name: registro_2027_09_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_09_diff_jsonb_idx;


--
-- TOC entry 9512 (class 0 OID 0)
-- Name: registro_2027_09_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_09_operacion_audit_timestamp_idx;


--
-- TOC entry 9513 (class 0 OID 0)
-- Name: registro_2027_09_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_09_pk_valor_idx;


--
-- TOC entry 9514 (class 0 OID 0)
-- Name: registro_2027_09_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_09_pkey;


--
-- TOC entry 9515 (class 0 OID 0)
-- Name: registro_2027_09_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_09_sesion_id_idx;


--
-- TOC entry 9516 (class 0 OID 0)
-- Name: registro_2027_09_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_09_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9517 (class 0 OID 0)
-- Name: registro_2027_09_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_09_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9518 (class 0 OID 0)
-- Name: registro_2027_10_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_10_audit_timestamp_idx;


--
-- TOC entry 9519 (class 0 OID 0)
-- Name: registro_2027_10_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_10_diff_jsonb_idx;


--
-- TOC entry 9520 (class 0 OID 0)
-- Name: registro_2027_10_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_10_operacion_audit_timestamp_idx;


--
-- TOC entry 9521 (class 0 OID 0)
-- Name: registro_2027_10_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_10_pk_valor_idx;


--
-- TOC entry 9522 (class 0 OID 0)
-- Name: registro_2027_10_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_10_pkey;


--
-- TOC entry 9523 (class 0 OID 0)
-- Name: registro_2027_10_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_10_sesion_id_idx;


--
-- TOC entry 9524 (class 0 OID 0)
-- Name: registro_2027_10_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_10_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9525 (class 0 OID 0)
-- Name: registro_2027_10_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_10_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9526 (class 0 OID 0)
-- Name: registro_2027_11_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_11_audit_timestamp_idx;


--
-- TOC entry 9527 (class 0 OID 0)
-- Name: registro_2027_11_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_11_diff_jsonb_idx;


--
-- TOC entry 9528 (class 0 OID 0)
-- Name: registro_2027_11_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_11_operacion_audit_timestamp_idx;


--
-- TOC entry 9529 (class 0 OID 0)
-- Name: registro_2027_11_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_11_pk_valor_idx;


--
-- TOC entry 9530 (class 0 OID 0)
-- Name: registro_2027_11_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_11_pkey;


--
-- TOC entry 9531 (class 0 OID 0)
-- Name: registro_2027_11_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_11_sesion_id_idx;


--
-- TOC entry 9532 (class 0 OID 0)
-- Name: registro_2027_11_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_11_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9533 (class 0 OID 0)
-- Name: registro_2027_11_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_11_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9534 (class 0 OID 0)
-- Name: registro_2027_12_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_2027_12_audit_timestamp_idx;


--
-- TOC entry 9535 (class 0 OID 0)
-- Name: registro_2027_12_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_2027_12_diff_jsonb_idx;


--
-- TOC entry 9536 (class 0 OID 0)
-- Name: registro_2027_12_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_2027_12_operacion_audit_timestamp_idx;


--
-- TOC entry 9537 (class 0 OID 0)
-- Name: registro_2027_12_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_2027_12_pk_valor_idx;


--
-- TOC entry 9538 (class 0 OID 0)
-- Name: registro_2027_12_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_2027_12_pkey;


--
-- TOC entry 9539 (class 0 OID 0)
-- Name: registro_2027_12_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_2027_12_sesion_id_idx;


--
-- TOC entry 9540 (class 0 OID 0)
-- Name: registro_2027_12_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_2027_12_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9541 (class 0 OID 0)
-- Name: registro_2027_12_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_2027_12_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9542 (class 0 OID 0)
-- Name: registro_default_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_ts_desc ATTACH PARTITION audit.registro_default_audit_timestamp_idx;


--
-- TOC entry 9543 (class 0 OID 0)
-- Name: registro_default_diff_jsonb_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_diff_gin ATTACH PARTITION audit.registro_default_diff_jsonb_idx;


--
-- TOC entry 9544 (class 0 OID 0)
-- Name: registro_default_operacion_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_operacion ATTACH PARTITION audit.registro_default_operacion_audit_timestamp_idx;


--
-- TOC entry 9545 (class 0 OID 0)
-- Name: registro_default_pk_valor_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_pk_gin ATTACH PARTITION audit.registro_default_pk_valor_idx;


--
-- TOC entry 9546 (class 0 OID 0)
-- Name: registro_default_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.registro_pkey ATTACH PARTITION audit.registro_default_pkey;


--
-- TOC entry 9547 (class 0 OID 0)
-- Name: registro_default_sesion_id_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_sesion ATTACH PARTITION audit.registro_default_sesion_id_idx;


--
-- TOC entry 9548 (class 0 OID 0)
-- Name: registro_default_tabla_nombre_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_tabla_ts ATTACH PARTITION audit.registro_default_tabla_nombre_audit_timestamp_idx;


--
-- TOC entry 9549 (class 0 OID 0)
-- Name: registro_default_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_reg_usuario_ts ATTACH PARTITION audit.registro_default_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9550 (class 0 OID 0)
-- Name: sesion_2026_04_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_2026_04_evento_audit_timestamp_idx;


--
-- TOC entry 9551 (class 0 OID 0)
-- Name: sesion_2026_04_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_2026_04_ip_address_audit_timestamp_idx;


--
-- TOC entry 9552 (class 0 OID 0)
-- Name: sesion_2026_04_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_2026_04_pkey;


--
-- TOC entry 9553 (class 0 OID 0)
-- Name: sesion_2026_04_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_2026_04_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9554 (class 0 OID 0)
-- Name: sesion_2026_05_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_2026_05_evento_audit_timestamp_idx;


--
-- TOC entry 9555 (class 0 OID 0)
-- Name: sesion_2026_05_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_2026_05_ip_address_audit_timestamp_idx;


--
-- TOC entry 9556 (class 0 OID 0)
-- Name: sesion_2026_05_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_2026_05_pkey;


--
-- TOC entry 9557 (class 0 OID 0)
-- Name: sesion_2026_05_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_2026_05_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9558 (class 0 OID 0)
-- Name: sesion_2026_06_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_2026_06_evento_audit_timestamp_idx;


--
-- TOC entry 9559 (class 0 OID 0)
-- Name: sesion_2026_06_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_2026_06_ip_address_audit_timestamp_idx;


--
-- TOC entry 9560 (class 0 OID 0)
-- Name: sesion_2026_06_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_2026_06_pkey;


--
-- TOC entry 9561 (class 0 OID 0)
-- Name: sesion_2026_06_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_2026_06_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9562 (class 0 OID 0)
-- Name: sesion_2026_07_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_2026_07_evento_audit_timestamp_idx;


--
-- TOC entry 9563 (class 0 OID 0)
-- Name: sesion_2026_07_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_2026_07_ip_address_audit_timestamp_idx;


--
-- TOC entry 9564 (class 0 OID 0)
-- Name: sesion_2026_07_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_2026_07_pkey;


--
-- TOC entry 9565 (class 0 OID 0)
-- Name: sesion_2026_07_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_2026_07_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9566 (class 0 OID 0)
-- Name: sesion_default_evento_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_evento ATTACH PARTITION audit.sesion_default_evento_audit_timestamp_idx;


--
-- TOC entry 9567 (class 0 OID 0)
-- Name: sesion_default_ip_address_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_ip ATTACH PARTITION audit.sesion_default_ip_address_audit_timestamp_idx;


--
-- TOC entry 9568 (class 0 OID 0)
-- Name: sesion_default_pkey; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.sesion_pkey ATTACH PARTITION audit.sesion_default_pkey;


--
-- TOC entry 9569 (class 0 OID 0)
-- Name: sesion_default_usuario_id_audit_timestamp_idx; Type: INDEX ATTACH; Schema: audit; Owner: -
--

ALTER INDEX audit.idx_audit_sesion_usuario_ts ATTACH PARTITION audit.sesion_default_usuario_id_audit_timestamp_idx;


--
-- TOC entry 9708 (class 2620 OID 189775)
-- Name: registro_catastral trg_catastro_updated_at; Type: TRIGGER; Schema: acometidas; Owner: -
--

CREATE TRIGGER trg_catastro_updated_at BEFORE UPDATE ON acometidas.registro_catastral FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- TOC entry 9703 (class 2620 OID 189776)
-- Name: contrato_servicio trg_contrato_updated_at; Type: TRIGGER; Schema: acometidas; Owner: -
--

CREATE TRIGGER trg_contrato_updated_at BEFORE UPDATE ON acometidas.contrato_servicio FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- TOC entry 9704 (class 2620 OID 189777)
-- Name: documento_adjunto trg_documento_updated_at; Type: TRIGGER; Schema: acometidas; Owner: -
--

CREATE TRIGGER trg_documento_updated_at BEFORE UPDATE ON acometidas.documento_adjunto FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- TOC entry 9705 (class 2620 OID 189778)
-- Name: factura_inspeccion trg_factura_updated_at; Type: TRIGGER; Schema: acometidas; Owner: -
--

CREATE TRIGGER trg_factura_updated_at BEFORE UPDATE ON acometidas.factura_inspeccion FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- TOC entry 9706 (class 2620 OID 189779)
-- Name: informe_inspeccion trg_informe_updated_at; Type: TRIGGER; Schema: acometidas; Owner: -
--

CREATE TRIGGER trg_informe_updated_at BEFORE UPDATE ON acometidas.informe_inspeccion FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- TOC entry 9707 (class 2620 OID 189780)
-- Name: inventario_medidor trg_medidor_updated_at; Type: TRIGGER; Schema: acometidas; Owner: -
--

CREATE TRIGGER trg_medidor_updated_at BEFORE UPDATE ON acometidas.inventario_medidor FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- TOC entry 9709 (class 2620 OID 189781)
-- Name: solicitud trg_solicitud_updated_at; Type: TRIGGER; Schema: acometidas; Owner: -
--

CREATE TRIGGER trg_solicitud_updated_at BEFORE UPDATE ON acometidas.solicitud FOR EACH ROW EXECUTE FUNCTION acometidas.fn_set_updated_at();


--
-- TOC entry 9710 (class 2620 OID 189782)
-- Name: solicitud trg_state_machine; Type: TRIGGER; Schema: acometidas; Owner: -
--

CREATE TRIGGER trg_state_machine BEFORE UPDATE OF estado ON acometidas.solicitud FOR EACH ROW EXECUTE FUNCTION acometidas.fn_enforce_state_machine();


--
-- TOC entry 9713 (class 2620 OID 189783)
-- Name: tabla_config trg_config_updated_at; Type: TRIGGER; Schema: audit; Owner: -
--

CREATE TRIGGER trg_config_updated_at BEFORE UPDATE ON audit.tabla_config FOR EACH ROW EXECUTE FUNCTION audit.fn_config_updated_at();


--
-- TOC entry 9714 (class 2620 OID 189784)
-- Name: acometida trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.acometida FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9719 (class 2620 OID 189785)
-- Name: canton trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.canton FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9720 (class 2620 OID 189786)
-- Name: cargo trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.cargo FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9721 (class 2620 OID 189787)
-- Name: categoria trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.categoria FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9723 (class 2620 OID 189788)
-- Name: ciudadano trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.ciudadano FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9725 (class 2620 OID 189789)
-- Name: claves_sql2000 trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.claves_sql2000 FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9726 (class 2620 OID 189790)
-- Name: cliente trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.cliente FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9730 (class 2620 OID 189791)
-- Name: cliente_persona_natural trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.cliente_persona_natural FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9732 (class 2620 OID 189792)
-- Name: cliente_usuario trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9736 (class 2620 OID 189793)
-- Name: componentes_fijos trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.componentes_fijos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9738 (class 2620 OID 189794)
-- Name: consumo_promedio trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.consumo_promedio FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9728 (class 2620 OID 189795)
-- Name: correo_electronico trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.correo_electronico FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9739 (class 2620 OID 189796)
-- Name: correo_empresa trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.correo_empresa FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9740 (class 2620 OID 189797)
-- Name: correo_persona_natural trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.correo_persona_natural FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9741 (class 2620 OID 189798)
-- Name: direccion trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.direccion FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9742 (class 2620 OID 189799)
-- Name: empleado_zona trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.empleado_zona FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9744 (class 2620 OID 189800)
-- Name: empleados trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9747 (class 2620 OID 189801)
-- Name: empresa trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.empresa FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9749 (class 2620 OID 189802)
-- Name: estado_civil trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.estado_civil FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9750 (class 2620 OID 189803)
-- Name: estado_cliente_usuario trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.estado_cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9751 (class 2620 OID 189804)
-- Name: estado_empleado trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.estado_empleado FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9752 (class 2620 OID 189805)
-- Name: estado_pago trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.estado_pago FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9753 (class 2620 OID 189806)
-- Name: factura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.factura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9755 (class 2620 OID 189807)
-- Name: forma_pago trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.forma_pago FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9756 (class 2620 OID 189808)
-- Name: foto_acometida trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.foto_acometida FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9757 (class 2620 OID 189809)
-- Name: foto_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.foto_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9758 (class 2620 OID 189810)
-- Name: lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9764 (class 2620 OID 189811)
-- Name: lectura_estado trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.lectura_estado FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9765 (class 2620 OID 189812)
-- Name: observacion trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.observacion FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9766 (class 2620 OID 189813)
-- Name: observacion_acometida trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.observacion_acometida FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9767 (class 2620 OID 189814)
-- Name: observacion_factura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.observacion_factura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9768 (class 2620 OID 189815)
-- Name: observacion_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.observacion_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9769 (class 2620 OID 189816)
-- Name: pais trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.pais FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9770 (class 2620 OID 189817)
-- Name: parroquia trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.parroquia FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9771 (class 2620 OID 189818)
-- Name: permiso_categoria trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.permiso_categoria FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9772 (class 2620 OID 189819)
-- Name: permisos trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.permisos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9774 (class 2620 OID 189820)
-- Name: predio trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.predio FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9776 (class 2620 OID 189821)
-- Name: profesion trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.profesion FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9777 (class 2620 OID 189822)
-- Name: provincia trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.provincia FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9778 (class 2620 OID 189823)
-- Name: qrcode trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.qrcode FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9779 (class 2620 OID 189824)
-- Name: rangos_variables trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.rangos_variables FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9781 (class 2620 OID 189825)
-- Name: refresh_tokens trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.refresh_tokens FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9783 (class 2620 OID 189826)
-- Name: rol_permisos trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.rol_permisos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9785 (class 2620 OID 189827)
-- Name: roles trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9787 (class 2620 OID 189828)
-- Name: seguimiento_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.seguimiento_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9789 (class 2620 OID 189829)
-- Name: servicio trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.servicio FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9790 (class 2620 OID 189830)
-- Name: sexo trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.sexo FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9791 (class 2620 OID 189831)
-- Name: siguiente_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.siguiente_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9794 (class 2620 OID 189832)
-- Name: tarifa trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tarifa FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9729 (class 2620 OID 189833)
-- Name: telefono trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.telefono FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9796 (class 2620 OID 189834)
-- Name: telefono_empresa trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.telefono_empresa FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9797 (class 2620 OID 189835)
-- Name: telefono_persona_natural trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.telefono_persona_natural FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9798 (class 2620 OID 189836)
-- Name: tipo_contrato trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_contrato FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9799 (class 2620 OID 189837)
-- Name: tipo_estado_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_estado_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9800 (class 2620 OID 189838)
-- Name: tipo_identificacion trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_identificacion FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9801 (class 2620 OID 189839)
-- Name: tipo_novedad_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_novedad_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9802 (class 2620 OID 189840)
-- Name: tipo_parroquia trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_parroquia FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9803 (class 2620 OID 189841)
-- Name: tipo_predio trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_predio FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9804 (class 2620 OID 189842)
-- Name: tipo_relacion_familiar trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_relacion_familiar FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9805 (class 2620 OID 189843)
-- Name: tipo_telefono trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_telefono FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9806 (class 2620 OID 189844)
-- Name: tipo_titulo_dato trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.tipo_titulo_dato FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9807 (class 2620 OID 189845)
-- Name: titulo_dato trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.titulo_dato FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9809 (class 2620 OID 189846)
-- Name: usuario_factura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuario_factura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9810 (class 2620 OID 189847)
-- Name: usuario_lectura trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuario_lectura FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9811 (class 2620 OID 189848)
-- Name: usuario_permisos trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuario_permisos FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9813 (class 2620 OID 189849)
-- Name: usuario_roles trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuario_roles FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9711 (class 2620 OID 189850)
-- Name: usuarios trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9815 (class 2620 OID 189851)
-- Name: zona trg_actualizar_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_updated_at BEFORE UPDATE ON public.zona FOR EACH ROW EXECUTE FUNCTION public.actualizar_updated_at();


--
-- TOC entry 9715 (class 2620 OID 189852)
-- Name: acometida trg_audit_acometida; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_acometida AFTER INSERT OR DELETE OR UPDATE ON public.acometida FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9722 (class 2620 OID 189853)
-- Name: categoria trg_audit_categoria; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_categoria AFTER INSERT OR DELETE OR UPDATE ON public.categoria FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9724 (class 2620 OID 189854)
-- Name: ciudadano trg_audit_ciudadano; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_ciudadano AFTER INSERT OR DELETE OR UPDATE ON public.ciudadano FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9727 (class 2620 OID 189855)
-- Name: cliente trg_audit_cliente; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_cliente AFTER INSERT OR DELETE OR UPDATE ON public.cliente FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9731 (class 2620 OID 189856)
-- Name: cliente_persona_natural trg_audit_cliente_persona_natural; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_cliente_persona_natural AFTER INSERT OR DELETE OR UPDATE ON public.cliente_persona_natural FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9733 (class 2620 OID 189857)
-- Name: cliente_usuario trg_audit_cliente_usuario; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_cliente_usuario AFTER INSERT OR DELETE OR UPDATE ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9737 (class 2620 OID 189858)
-- Name: componentes_fijos trg_audit_componentes_fijos; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_componentes_fijos AFTER INSERT OR DELETE OR UPDATE ON public.componentes_fijos FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9743 (class 2620 OID 189859)
-- Name: empleado_zona trg_audit_empleado_zona; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_empleado_zona AFTER INSERT OR DELETE OR UPDATE ON public.empleado_zona FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9745 (class 2620 OID 189860)
-- Name: empleados trg_audit_empleados; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_empleados AFTER INSERT OR DELETE OR UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9748 (class 2620 OID 189861)
-- Name: empresa trg_audit_empresa; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_empresa AFTER INSERT OR DELETE OR UPDATE ON public.empresa FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9754 (class 2620 OID 189862)
-- Name: factura trg_audit_factura; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_factura AFTER INSERT OR DELETE OR UPDATE ON public.factura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9759 (class 2620 OID 189863)
-- Name: lectura trg_audit_lectura; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_lectura AFTER INSERT OR DELETE OR UPDATE ON public.lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9773 (class 2620 OID 189864)
-- Name: permisos trg_audit_permisos; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_permisos AFTER INSERT OR DELETE OR UPDATE ON public.permisos FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9775 (class 2620 OID 189865)
-- Name: predio trg_audit_predio; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_predio AFTER INSERT OR DELETE OR UPDATE ON public.predio FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9780 (class 2620 OID 189866)
-- Name: rangos_variables trg_audit_rangos_variables; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_rangos_variables AFTER INSERT OR DELETE OR UPDATE ON public.rangos_variables FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9782 (class 2620 OID 189867)
-- Name: refresh_tokens trg_audit_refresh_tokens; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_refresh_tokens AFTER INSERT OR DELETE OR UPDATE ON public.refresh_tokens FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9784 (class 2620 OID 189868)
-- Name: rol_permisos trg_audit_rol_permisos; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_rol_permisos AFTER INSERT OR DELETE OR UPDATE ON public.rol_permisos FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9786 (class 2620 OID 189869)
-- Name: roles trg_audit_roles; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_roles AFTER INSERT OR DELETE OR UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9792 (class 2620 OID 189870)
-- Name: siguiente_lectura trg_audit_siguiente_lectura; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_siguiente_lectura AFTER INSERT OR DELETE OR UPDATE ON public.siguiente_lectura FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9795 (class 2620 OID 189871)
-- Name: tarifa trg_audit_tarifa; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_tarifa AFTER INSERT OR DELETE OR UPDATE ON public.tarifa FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9808 (class 2620 OID 189872)
-- Name: titulo_dato trg_audit_titulo_dato; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_titulo_dato AFTER INSERT OR DELETE OR UPDATE ON public.titulo_dato FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9812 (class 2620 OID 189873)
-- Name: usuario_permisos trg_audit_usuario_permisos; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_usuario_permisos AFTER INSERT OR DELETE OR UPDATE ON public.usuario_permisos FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9814 (class 2620 OID 189874)
-- Name: usuario_roles trg_audit_usuario_roles; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_usuario_roles AFTER INSERT OR DELETE OR UPDATE ON public.usuario_roles FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9712 (class 2620 OID 189875)
-- Name: usuarios trg_audit_usuarios; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_usuarios AFTER INSERT OR DELETE OR UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9816 (class 2620 OID 189876)
-- Name: zona trg_audit_zona; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_audit_zona AFTER INSERT OR DELETE OR UPDATE ON public.zona FOR EACH ROW EXECUTE FUNCTION audit.fn_registrar();


--
-- TOC entry 9760 (class 2620 OID 189877)
-- Name: lectura trg_auditar_lectura; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auditar_lectura AFTER INSERT OR UPDATE OF lectura_estado_id ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_estado();


--
-- TOC entry 9821 (class 2620 OID 190822)
-- Name: auditoria_lectura_sector trg_auto_cierre_auditoria; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_auto_cierre_auditoria BEFORE UPDATE OF total_completadas, total_esperado, completo ON public.auditoria_lectura_sector FOR EACH ROW EXECUTE FUNCTION public.fn_auto_cierre_auditoria();


--
-- TOC entry 9761 (class 2620 OID 189878)
-- Name: lectura trg_block_duplicate_lectura; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_block_duplicate_lectura BEFORE INSERT ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.fn_block_duplicate_lectura();


--
-- TOC entry 9734 (class 2620 OID 189879)
-- Name: cliente_usuario trg_cliente_usuario_lockout; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_cliente_usuario_lockout BEFORE INSERT OR UPDATE OF lockout_until ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.trg_update_is_locked_out();


--
-- TOC entry 9762 (class 2620 OID 189880)
-- Name: lectura trg_control_siguiente_mensual; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_control_siguiente_mensual AFTER INSERT ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.fn_control_siguiente_lectura_mensual();


--
-- TOC entry 9820 (class 2620 OID 190719)
-- Name: historial_estados_acometida trg_gestionar_estados; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_gestionar_estados BEFORE INSERT ON public.historial_estados_acometida FOR EACH ROW EXECUTE FUNCTION public.fn_actualizar_estado_activo();


--
-- TOC entry 9716 (class 2620 OID 189881)
-- Name: acometida trg_insert_cambio_medidor_reading; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_insert_cambio_medidor_reading AFTER UPDATE OF numero_medidor ON public.acometida FOR EACH ROW WHEN (((old.numero_medidor)::text IS DISTINCT FROM (new.numero_medidor)::text)) EXECUTE FUNCTION public.fn_insert_cambio_medidor_reading();


--
-- TOC entry 9717 (class 2620 OID 189882)
-- Name: acometida trg_insert_initial_reading_full; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_insert_initial_reading_full AFTER INSERT ON public.acometida FOR EACH ROW EXECUTE FUNCTION public.fn_insert_initial_reading_full();


--
-- TOC entry 9735 (class 2620 OID 189883)
-- Name: cliente_usuario trg_update_cliente_usuario_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_cliente_usuario_timestamp BEFORE UPDATE ON public.cliente_usuario FOR EACH ROW EXECUTE FUNCTION public.update_cliente_usuario_timestamp();


--
-- TOC entry 9763 (class 2620 OID 189884)
-- Name: lectura trg_update_consumo_promedio; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_consumo_promedio AFTER INSERT OR UPDATE ON public.lectura FOR EACH ROW EXECUTE FUNCTION public.update_consumo_promedio();


--
-- TOC entry 9746 (class 2620 OID 189885)
-- Name: empleados trg_update_empleados_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_empleados_timestamp BEFORE UPDATE ON public.empleados FOR EACH ROW EXECUTE FUNCTION public.update_empleados_timestamp();


--
-- TOC entry 9718 (class 2620 OID 189886)
-- Name: acometida trg_update_meter_reading; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_meter_reading AFTER UPDATE OF numero_medidor ON public.acometida FOR EACH ROW WHEN ((((old.numero_medidor)::text IS DISTINCT FROM (new.numero_medidor)::text) AND (new.numero_medidor IS NOT NULL))) EXECUTE FUNCTION public.fn_update_meter_reading_initial();


--
-- TOC entry 9788 (class 2620 OID 189887)
-- Name: seguimiento_lectura trg_update_timestamp_seguimiento_lectura; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_timestamp_seguimiento_lectura BEFORE UPDATE ON public.seguimiento_lectura FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 9793 (class 2620 OID 189888)
-- Name: siguiente_lectura trg_update_timestamp_siguiente_lectura; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_timestamp_siguiente_lectura BEFORE UPDATE ON public.siguiente_lectura FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 9818 (class 2620 OID 189889)
-- Name: orden_trabajo trg_generar_codigo_orden; Type: TRIGGER; Schema: work_orders; Owner: -
--

CREATE TRIGGER trg_generar_codigo_orden BEFORE INSERT ON work_orders.orden_trabajo FOR EACH ROW EXECUTE FUNCTION work_orders.generar_codigo_orden();


--
-- TOC entry 9819 (class 2620 OID 189890)
-- Name: orden_trabajo trg_registrar_cambio_estado; Type: TRIGGER; Schema: work_orders; Owner: -
--

CREATE TRIGGER trg_registrar_cambio_estado AFTER INSERT OR UPDATE OF estado ON work_orders.orden_trabajo FOR EACH ROW EXECUTE FUNCTION work_orders.registrar_cambio_estado();


--
-- TOC entry 9817 (class 2620 OID 189891)
-- Name: auditoria_inv_inventario trg_set_updated_at; Type: TRIGGER; Schema: work_orders; Owner: -
--

CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON work_orders.auditoria_inv_inventario FOR EACH ROW EXECUTE FUNCTION work_orders.set_updated_at();


--
-- TOC entry 9570 (class 2606 OID 189892)
-- Name: contrato_servicio contrato_servicio_id_generador_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_generador_fkey FOREIGN KEY (id_generador) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9571 (class 2606 OID 189897)
-- Name: contrato_servicio contrato_servicio_id_medidor_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_medidor_fkey FOREIGN KEY (id_medidor) REFERENCES acometidas.inventario_medidor(id_medidor);


--
-- TOC entry 9572 (class 2606 OID 189902)
-- Name: contrato_servicio contrato_servicio_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud);


--
-- TOC entry 9573 (class 2606 OID 189907)
-- Name: contrato_servicio contrato_servicio_id_tarifa_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.contrato_servicio
    ADD CONSTRAINT contrato_servicio_id_tarifa_fkey FOREIGN KEY (id_tarifa) REFERENCES public.tarifa(tarifa_id);


--
-- TOC entry 9574 (class 2606 OID 189912)
-- Name: documento_adjunto documento_adjunto_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.documento_adjunto
    ADD CONSTRAINT documento_adjunto_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud) ON DELETE CASCADE;


--
-- TOC entry 9575 (class 2606 OID 189917)
-- Name: documento_adjunto documento_adjunto_id_tipo_documento_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.documento_adjunto
    ADD CONSTRAINT documento_adjunto_id_tipo_documento_fkey FOREIGN KEY (id_tipo_documento) REFERENCES acometidas.catalogo_tipo_documento(id);


--
-- TOC entry 9576 (class 2606 OID 189922)
-- Name: documento_adjunto documento_adjunto_id_validador_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.documento_adjunto
    ADD CONSTRAINT documento_adjunto_id_validador_fkey FOREIGN KEY (id_validador) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9577 (class 2606 OID 189927)
-- Name: factura_inspeccion factura_inspeccion_id_cajero_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_id_cajero_fkey FOREIGN KEY (id_cajero) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9578 (class 2606 OID 189932)
-- Name: factura_inspeccion factura_inspeccion_id_concepto_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_id_concepto_fkey FOREIGN KEY (id_concepto) REFERENCES acometidas.catalogo_concepto_factura(id);


--
-- TOC entry 9579 (class 2606 OID 189937)
-- Name: factura_inspeccion factura_inspeccion_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.factura_inspeccion
    ADD CONSTRAINT factura_inspeccion_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud);


--
-- TOC entry 9580 (class 2606 OID 189942)
-- Name: historial_estado historial_estado_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.historial_estado
    ADD CONSTRAINT historial_estado_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud) ON DELETE CASCADE;


--
-- TOC entry 9581 (class 2606 OID 189947)
-- Name: historial_estado historial_estado_id_usuario_accion_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.historial_estado
    ADD CONSTRAINT historial_estado_id_usuario_accion_fkey FOREIGN KEY (id_usuario_accion) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9582 (class 2606 OID 189952)
-- Name: informe_inspeccion informe_inspeccion_id_aprobador_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_id_aprobador_fkey FOREIGN KEY (id_aprobador) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9583 (class 2606 OID 189957)
-- Name: informe_inspeccion informe_inspeccion_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo);


--
-- TOC entry 9584 (class 2606 OID 189962)
-- Name: informe_inspeccion informe_inspeccion_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.informe_inspeccion
    ADD CONSTRAINT informe_inspeccion_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud);


--
-- TOC entry 9585 (class 2606 OID 189967)
-- Name: notificacion notificacion_id_destinatario_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.notificacion
    ADD CONSTRAINT notificacion_id_destinatario_fkey FOREIGN KEY (id_destinatario) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9586 (class 2606 OID 189972)
-- Name: notificacion notificacion_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.notificacion
    ADD CONSTRAINT notificacion_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud) ON DELETE CASCADE;


--
-- TOC entry 9587 (class 2606 OID 189977)
-- Name: registro_catastral registro_catastral_id_contrato_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_id_contrato_fkey FOREIGN KEY (id_contrato) REFERENCES acometidas.contrato_servicio(id_contrato);


--
-- TOC entry 9588 (class 2606 OID 189982)
-- Name: registro_catastral registro_catastral_id_registrador_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_id_registrador_fkey FOREIGN KEY (id_registrador) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9589 (class 2606 OID 189987)
-- Name: registro_catastral registro_catastral_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.registro_catastral
    ADD CONSTRAINT registro_catastral_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud);


--
-- TOC entry 9590 (class 2606 OID 189992)
-- Name: solicitud solicitud_id_analista_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_id_analista_fkey FOREIGN KEY (id_analista) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9591 (class 2606 OID 189997)
-- Name: solicitud solicitud_id_cliente_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.solicitud
    ADD CONSTRAINT solicitud_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.cliente(cliente_id);


--
-- TOC entry 9592 (class 2606 OID 190002)
-- Name: solicitud_orden_trabajo solicitud_orden_trabajo_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.solicitud_orden_trabajo
    ADD CONSTRAINT solicitud_orden_trabajo_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo);


--
-- TOC entry 9593 (class 2606 OID 190007)
-- Name: solicitud_orden_trabajo solicitud_orden_trabajo_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: acometidas; Owner: -
--

ALTER TABLE ONLY acometidas.solicitud_orden_trabajo
    ADD CONSTRAINT solicitud_orden_trabajo_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES acometidas.solicitud(id_solicitud) ON DELETE CASCADE;


--
-- TOC entry 9594 (class 2606 OID 190720)
-- Name: acometida acometida_estado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT acometida_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.cat_estados_acometida(id_estado);


--
-- TOC entry 9610 (class 2606 OID 190012)
-- Name: cliente_usuario cliente_usuario_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9611 (class 2606 OID 190017)
-- Name: cliente_usuario cliente_usuario_estado_cliente_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_estado_cliente_usuario_id_fkey FOREIGN KEY (estado_cliente_usuario_id) REFERENCES public.estado_cliente_usuario(estado_cliente_usuario_id);


--
-- TOC entry 9612 (class 2606 OID 190022)
-- Name: cliente_usuario cliente_usuario_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT cliente_usuario_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9614 (class 2606 OID 190027)
-- Name: componentes_fijos componentes_fijos_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.componentes_fijos
    ADD CONSTRAINT componentes_fijos_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicio(servicio_id);


--
-- TOC entry 9615 (class 2606 OID 190032)
-- Name: componentes_fijos componentes_fijos_tarifa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.componentes_fijos
    ADD CONSTRAINT componentes_fijos_tarifa_id_fkey FOREIGN KEY (tarifa_id) REFERENCES public.tarifa(tarifa_id);


--
-- TOC entry 9622 (class 2606 OID 190037)
-- Name: empleado_zona empleado_zona_empleado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleado_zona
    ADD CONSTRAINT empleado_zona_empleado_id_fkey FOREIGN KEY (empleado_id) REFERENCES public.empleados(empleado_id) ON DELETE CASCADE;


--
-- TOC entry 9623 (class 2606 OID 190042)
-- Name: empleado_zona empleado_zona_zona_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleado_zona
    ADD CONSTRAINT empleado_zona_zona_id_fkey FOREIGN KEY (zona_id) REFERENCES public.zona(zona_id) ON DELETE CASCADE;


--
-- TOC entry 9624 (class 2606 OID 190047)
-- Name: empleados empleados_cargo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_cargo_id_fkey FOREIGN KEY (cargo_id) REFERENCES public.cargo(cargo_id);


--
-- TOC entry 9625 (class 2606 OID 190052)
-- Name: empleados empleados_ciudadano_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_ciudadano_id_fkey FOREIGN KEY (ciudadano_id) REFERENCES public.ciudadano(ciudadano_id) ON DELETE SET NULL;


--
-- TOC entry 9626 (class 2606 OID 190057)
-- Name: empleados empleados_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9627 (class 2606 OID 190062)
-- Name: empleados empleados_estado_empleado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_estado_empleado_id_fkey FOREIGN KEY (estado_empleado_id) REFERENCES public.estado_empleado(estado_empleado_id);


--
-- TOC entry 9628 (class 2606 OID 190067)
-- Name: empleados empleados_sexo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_sexo_id_fkey FOREIGN KEY (sexo_id) REFERENCES public.sexo(sexo_id);


--
-- TOC entry 9629 (class 2606 OID 190072)
-- Name: empleados empleados_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.empleados(empleado_id);


--
-- TOC entry 9630 (class 2606 OID 190077)
-- Name: empleados empleados_tipo_contrato_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_tipo_contrato_id_fkey FOREIGN KEY (tipo_contrato_id) REFERENCES public.tipo_contrato(tipo_contrato_id);


--
-- TOC entry 9631 (class 2606 OID 190082)
-- Name: empleados empleados_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT empleados_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9595 (class 2606 OID 190087)
-- Name: acometida fk_acometida_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT fk_acometida_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- TOC entry 9596 (class 2606 OID 190092)
-- Name: acometida fk_acometida_predio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT fk_acometida_predio FOREIGN KEY (predio_clave_catastral) REFERENCES public.predio(clave_catastral) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 9597 (class 2606 OID 190097)
-- Name: acometida fk_acometida_tarifa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT fk_acometida_tarifa FOREIGN KEY (tarifa_id) REFERENCES public.tarifa(tarifa_id);


--
-- TOC entry 9598 (class 2606 OID 190102)
-- Name: acometida fk_acometida_zona; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acometida
    ADD CONSTRAINT fk_acometida_zona FOREIGN KEY (zona_id) REFERENCES public.zona(zona_id);


--
-- TOC entry 9599 (class 2606 OID 190107)
-- Name: canton fk_canton_provincia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.canton
    ADD CONSTRAINT fk_canton_provincia FOREIGN KEY (provincia_id) REFERENCES public.provincia(provincia_id);


--
-- TOC entry 9600 (class 2606 OID 190112)
-- Name: ciudadano fk_ciudadano_estado_civil; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT fk_ciudadano_estado_civil FOREIGN KEY (estado_civil_id) REFERENCES public.estado_civil(estado_civil_id);


--
-- TOC entry 9601 (class 2606 OID 190117)
-- Name: ciudadano fk_ciudadano_parroquia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT fk_ciudadano_parroquia FOREIGN KEY (parroquia_id) REFERENCES public.parroquia(parroquia_id);


--
-- TOC entry 9602 (class 2606 OID 190122)
-- Name: ciudadano fk_ciudadano_profesion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT fk_ciudadano_profesion FOREIGN KEY (profesion_id) REFERENCES public.profesion(profesion_id);


--
-- TOC entry 9603 (class 2606 OID 190127)
-- Name: ciudadano fk_ciudadano_sexo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ciudadano
    ADD CONSTRAINT fk_ciudadano_sexo FOREIGN KEY (sexo_id) REFERENCES public.sexo(sexo_id);


--
-- TOC entry 9608 (class 2606 OID 190132)
-- Name: cliente_persona_natural fk_cliente_persona_natural_ciudadano; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_persona_natural
    ADD CONSTRAINT fk_cliente_persona_natural_ciudadano FOREIGN KEY (ciudadano_id) REFERENCES public.ciudadano(ciudadano_id);


--
-- TOC entry 9609 (class 2606 OID 190137)
-- Name: cliente_persona_natural fk_cliente_persona_natural_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_persona_natural
    ADD CONSTRAINT fk_cliente_persona_natural_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- TOC entry 9654 (class 2606 OID 190142)
-- Name: predio fk_cliente_predio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predio
    ADD CONSTRAINT fk_cliente_predio FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- TOC entry 9604 (class 2606 OID 190147)
-- Name: cliente fk_cliente_tipo_identificacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT fk_cliente_tipo_identificacion FOREIGN KEY (tipo_identificacion_id) REFERENCES public.tipo_identificacion(tipo_identificacion_id);


--
-- TOC entry 9613 (class 2606 OID 190152)
-- Name: cliente_usuario fk_cliente_usuario_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente_usuario
    ADD CONSTRAINT fk_cliente_usuario_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id) ON DELETE CASCADE;


--
-- TOC entry 9616 (class 2606 OID 190157)
-- Name: consumo_promedio fk_consumo_promedio_acometida; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consumo_promedio
    ADD CONSTRAINT fk_consumo_promedio_acometida FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 9605 (class 2606 OID 190162)
-- Name: correo_electronico fk_correo_electronico_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_electronico
    ADD CONSTRAINT fk_correo_electronico_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- TOC entry 9617 (class 2606 OID 190167)
-- Name: correo_empresa fk_correo_empresa_correo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_empresa
    ADD CONSTRAINT fk_correo_empresa_correo FOREIGN KEY (correo_electronico_id) REFERENCES public.correo_electronico(correo_electronico_id);


--
-- TOC entry 9618 (class 2606 OID 190172)
-- Name: correo_empresa fk_correo_empresa_empresa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_empresa
    ADD CONSTRAINT fk_correo_empresa_empresa FOREIGN KEY (empresa_id) REFERENCES public.empresa(empresa_id);


--
-- TOC entry 9619 (class 2606 OID 190177)
-- Name: correo_persona_natural fk_correo_persona_natural_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_persona_natural
    ADD CONSTRAINT fk_correo_persona_natural_cliente FOREIGN KEY (cliente_persona_natural_id) REFERENCES public.cliente_persona_natural(cliente_persona_natural_id);


--
-- TOC entry 9620 (class 2606 OID 190182)
-- Name: correo_persona_natural fk_correo_persona_natural_correo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.correo_persona_natural
    ADD CONSTRAINT fk_correo_persona_natural_correo FOREIGN KEY (correo_electronico_id) REFERENCES public.correo_electronico(correo_electronico_id);


--
-- TOC entry 9621 (class 2606 OID 190187)
-- Name: direccion fk_direccion_parroquia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.direccion
    ADD CONSTRAINT fk_direccion_parroquia FOREIGN KEY (parroquia_id) REFERENCES public.parroquia(parroquia_id);


--
-- TOC entry 9632 (class 2606 OID 190192)
-- Name: empleados fk_empleados_ciudadano; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT fk_empleados_ciudadano FOREIGN KEY (ciudadano_id) REFERENCES public.ciudadano(ciudadano_id) ON DELETE SET NULL;


--
-- TOC entry 9633 (class 2606 OID 190197)
-- Name: empleados fk_empleados_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empleados
    ADD CONSTRAINT fk_empleados_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 9634 (class 2606 OID 190202)
-- Name: empresa fk_empresa_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT fk_empresa_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- TOC entry 9635 (class 2606 OID 190207)
-- Name: empresa fk_empresa_parroquia; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT fk_empresa_parroquia FOREIGN KEY (parroquia_id) REFERENCES public.parroquia(parroquia_id);


--
-- TOC entry 9636 (class 2606 OID 190212)
-- Name: factura fk_factura_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_factura_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- TOC entry 9637 (class 2606 OID 190217)
-- Name: factura fk_factura_estado_pago; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_factura_estado_pago FOREIGN KEY (estado_pago_id) REFERENCES public.estado_pago(estado_pago_id);


--
-- TOC entry 9638 (class 2606 OID 190222)
-- Name: factura fk_factura_forma_pago; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.factura
    ADD CONSTRAINT fk_factura_forma_pago FOREIGN KEY (forma_pago_id) REFERENCES public.forma_pago(forma_pago_id);


--
-- TOC entry 9639 (class 2606 OID 190227)
-- Name: foto_acometida fk_foto_acometida_acometida; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foto_acometida
    ADD CONSTRAINT fk_foto_acometida_acometida FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id) ON DELETE CASCADE;


--
-- TOC entry 9640 (class 2606 OID 190232)
-- Name: foto_lectura fk_foto_lectura_lectura; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.foto_lectura
    ADD CONSTRAINT fk_foto_lectura_lectura FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id);


--
-- TOC entry 9641 (class 2606 OID 190237)
-- Name: lectura fk_lectura_acometida; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura
    ADD CONSTRAINT fk_lectura_acometida FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- TOC entry 9644 (class 2606 OID 190242)
-- Name: lectura_estado fk_lectura_estado_tipo_estado_lectura; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura_estado
    ADD CONSTRAINT fk_lectura_estado_tipo_estado_lectura FOREIGN KEY (tipo_estado_lectura_id) REFERENCES public.tipo_estado_lectura(tipo_estado_lectura_id);


--
-- TOC entry 9642 (class 2606 OID 190247)
-- Name: lectura fk_lectura_lectura_estado; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura
    ADD CONSTRAINT fk_lectura_lectura_estado FOREIGN KEY (lectura_estado_id) REFERENCES public.lectura_estado(lectura_estado_id);


--
-- TOC entry 9643 (class 2606 OID 190252)
-- Name: lectura fk_lectura_tipo_novedad_lectura; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lectura
    ADD CONSTRAINT fk_lectura_tipo_novedad_lectura FOREIGN KEY (tipo_novedad_lectura_id) REFERENCES public.tipo_novedad_lectura(tipo_novedad_lectura_id);


--
-- TOC entry 9645 (class 2606 OID 190257)
-- Name: observacion_acometida fk_observacion_acometida_acometida; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_acometida
    ADD CONSTRAINT fk_observacion_acometida_acometida FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- TOC entry 9646 (class 2606 OID 190262)
-- Name: observacion_acometida fk_observacion_acometida_observacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_acometida
    ADD CONSTRAINT fk_observacion_acometida_observacion FOREIGN KEY (observacion_id) REFERENCES public.observacion(observacion_id);


--
-- TOC entry 9647 (class 2606 OID 190267)
-- Name: observacion_factura fk_observacion_factura_factura; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_factura
    ADD CONSTRAINT fk_observacion_factura_factura FOREIGN KEY (factura_id) REFERENCES public.factura(factura_id);


--
-- TOC entry 9648 (class 2606 OID 190272)
-- Name: observacion_factura fk_observacion_factura_observacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_factura
    ADD CONSTRAINT fk_observacion_factura_observacion FOREIGN KEY (observacion_id) REFERENCES public.observacion(observacion_id);


--
-- TOC entry 9649 (class 2606 OID 190277)
-- Name: observacion_lectura fk_observacion_lectura_lectura; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_lectura
    ADD CONSTRAINT fk_observacion_lectura_lectura FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id);


--
-- TOC entry 9650 (class 2606 OID 190282)
-- Name: observacion_lectura fk_observacion_lectura_observacion; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observacion_lectura
    ADD CONSTRAINT fk_observacion_lectura_observacion FOREIGN KEY (observacion_id) REFERENCES public.observacion(observacion_id);


--
-- TOC entry 9651 (class 2606 OID 190287)
-- Name: parroquia fk_parroquia_canton; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parroquia
    ADD CONSTRAINT fk_parroquia_canton FOREIGN KEY (canton_id) REFERENCES public.canton(canton_id);


--
-- TOC entry 9652 (class 2606 OID 190292)
-- Name: parroquia fk_parroquia_tipo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parroquia
    ADD CONSTRAINT fk_parroquia_tipo FOREIGN KEY (tipo_parroquia_id) REFERENCES public.tipo_parroquia(tipo_parroquia_id);


--
-- TOC entry 9653 (class 2606 OID 190297)
-- Name: permisos fk_permisos_categoria; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT fk_permisos_categoria FOREIGN KEY (categoria_id) REFERENCES public.permiso_categoria(categoria_id) ON DELETE SET NULL;


--
-- TOC entry 9655 (class 2606 OID 190302)
-- Name: predio fk_predio_tipo_predio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predio
    ADD CONSTRAINT fk_predio_tipo_predio FOREIGN KEY (tipo_predio_id) REFERENCES public.tipo_predio(tipo_predio_id);


--
-- TOC entry 9656 (class 2606 OID 190307)
-- Name: provincia fk_provincia_pais; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provincia
    ADD CONSTRAINT fk_provincia_pais FOREIGN KEY (pais_id) REFERENCES public.pais(pais_id);


--
-- TOC entry 9606 (class 2606 OID 190312)
-- Name: telefono fk_telefono_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT fk_telefono_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- TOC entry 9672 (class 2606 OID 190317)
-- Name: telefono_empresa fk_telefono_empresa_empresa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono_empresa
    ADD CONSTRAINT fk_telefono_empresa_empresa FOREIGN KEY (empresa_id) REFERENCES public.empresa(empresa_id);


--
-- TOC entry 9673 (class 2606 OID 190322)
-- Name: telefono_empresa fk_telefono_empresa_telefono; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono_empresa
    ADD CONSTRAINT fk_telefono_empresa_telefono FOREIGN KEY (telefono_id) REFERENCES public.telefono(telefono_id);


--
-- TOC entry 9674 (class 2606 OID 190327)
-- Name: telefono_persona_natural fk_telefono_persona_natural_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono_persona_natural
    ADD CONSTRAINT fk_telefono_persona_natural_cliente FOREIGN KEY (cliente_persona_natural_id) REFERENCES public.cliente_persona_natural(cliente_persona_natural_id);


--
-- TOC entry 9675 (class 2606 OID 190332)
-- Name: telefono_persona_natural fk_telefono_persona_natural_telefono; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono_persona_natural
    ADD CONSTRAINT fk_telefono_persona_natural_telefono FOREIGN KEY (telefono_id) REFERENCES public.telefono(telefono_id);


--
-- TOC entry 9607 (class 2606 OID 190337)
-- Name: telefono fk_telefono_tipo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT fk_telefono_tipo FOREIGN KEY (tipo_telefono_id) REFERENCES public.tipo_telefono(tipo_telefono_id);


--
-- TOC entry 9676 (class 2606 OID 190342)
-- Name: titulo_dato fk_titulo_dato_cliente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.titulo_dato
    ADD CONSTRAINT fk_titulo_dato_cliente FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- TOC entry 9677 (class 2606 OID 190347)
-- Name: titulo_dato fk_titulo_dato_tipo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.titulo_dato
    ADD CONSTRAINT fk_titulo_dato_tipo FOREIGN KEY (tipo_titulo_dato_id) REFERENCES public.tipo_titulo_dato(tipo_titulo_dato_id);


--
-- TOC entry 9678 (class 2606 OID 190352)
-- Name: usuario_factura fk_usuario_factura_factura; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_factura
    ADD CONSTRAINT fk_usuario_factura_factura FOREIGN KEY (factura_id) REFERENCES public.factura(factura_id);


--
-- TOC entry 9679 (class 2606 OID 190357)
-- Name: usuario_factura fk_usuario_factura_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_factura
    ADD CONSTRAINT fk_usuario_factura_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9680 (class 2606 OID 190362)
-- Name: usuario_lectura fk_usuario_lectura_lectura; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_lectura
    ADD CONSTRAINT fk_usuario_lectura_lectura FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id);


--
-- TOC entry 9681 (class 2606 OID 190367)
-- Name: usuario_lectura fk_usuario_lectura_usuario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_lectura
    ADD CONSTRAINT fk_usuario_lectura_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9700 (class 2606 OID 190703)
-- Name: historial_estados_acometida historial_estados_acometida_acometida_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_estados_acometida
    ADD CONSTRAINT historial_estados_acometida_acometida_id_fkey FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- TOC entry 9701 (class 2606 OID 190708)
-- Name: historial_estados_acometida historial_estados_acometida_estado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_estados_acometida
    ADD CONSTRAINT historial_estados_acometida_estado_id_fkey FOREIGN KEY (estado_id) REFERENCES public.cat_estados_acometida(id_estado);


--
-- TOC entry 9702 (class 2606 OID 190713)
-- Name: historial_estados_acometida historial_estados_acometida_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historial_estados_acometida
    ADD CONSTRAINT historial_estados_acometida_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9657 (class 2606 OID 190372)
-- Name: qrcode qrcode_acometida_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qrcode
    ADD CONSTRAINT qrcode_acometida_id_fkey FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id) ON DELETE CASCADE;


--
-- TOC entry 9658 (class 2606 OID 190377)
-- Name: rangos_variables rangos_variables_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rangos_variables
    ADD CONSTRAINT rangos_variables_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicio(servicio_id);


--
-- TOC entry 9659 (class 2606 OID 190382)
-- Name: rangos_variables rangos_variables_tarifa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rangos_variables
    ADD CONSTRAINT rangos_variables_tarifa_id_fkey FOREIGN KEY (tarifa_id) REFERENCES public.tarifa(tarifa_id);


--
-- TOC entry 9660 (class 2606 OID 190387)
-- Name: refresh_tokens refresh_tokens_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 9661 (class 2606 OID 190392)
-- Name: rol_permisos rol_permisos_permiso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES public.permisos(permiso_id) ON DELETE CASCADE;


--
-- TOC entry 9662 (class 2606 OID 190397)
-- Name: rol_permisos rol_permisos_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id) ON DELETE CASCADE;


--
-- TOC entry 9663 (class 2606 OID 190402)
-- Name: roles roles_parent_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_parent_rol_id_fkey FOREIGN KEY (parent_rol_id) REFERENCES public.roles(rol_id);


--
-- TOC entry 9664 (class 2606 OID 190407)
-- Name: seguimiento_lectura seguimiento_lectura_acometida_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_acometida_id_fkey FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- TOC entry 9665 (class 2606 OID 190412)
-- Name: seguimiento_lectura seguimiento_lectura_lectura_estado_anterior_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_lectura_estado_anterior_id_fkey FOREIGN KEY (lectura_estado_anterior_id) REFERENCES public.lectura_estado(lectura_estado_id);


--
-- TOC entry 9666 (class 2606 OID 190417)
-- Name: seguimiento_lectura seguimiento_lectura_lectura_estado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_lectura_estado_id_fkey FOREIGN KEY (lectura_estado_id) REFERENCES public.lectura_estado(lectura_estado_id);


--
-- TOC entry 9667 (class 2606 OID 190422)
-- Name: seguimiento_lectura seguimiento_lectura_lectura_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_lectura_id_fkey FOREIGN KEY (lectura_id) REFERENCES public.lectura(lectura_id);


--
-- TOC entry 9668 (class 2606 OID 190427)
-- Name: seguimiento_lectura seguimiento_lectura_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seguimiento_lectura
    ADD CONSTRAINT seguimiento_lectura_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 9669 (class 2606 OID 190432)
-- Name: siguiente_lectura siguiente_lectura_acometida_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.siguiente_lectura
    ADD CONSTRAINT siguiente_lectura_acometida_id_fkey FOREIGN KEY (acometida_id) REFERENCES public.acometida(acometida_id);


--
-- TOC entry 9670 (class 2606 OID 190437)
-- Name: siguiente_lectura siguiente_lectura_ultima_lectura_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.siguiente_lectura
    ADD CONSTRAINT siguiente_lectura_ultima_lectura_id_fkey FOREIGN KEY (ultima_lectura_id) REFERENCES public.lectura(lectura_id);


--
-- TOC entry 9671 (class 2606 OID 190442)
-- Name: tarifa tarifa_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tarifa
    ADD CONSTRAINT tarifa_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categoria(categoria_id);


--
-- TOC entry 9682 (class 2606 OID 190447)
-- Name: usuario_permisos usuario_permisos_permiso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES public.permisos(permiso_id) ON DELETE CASCADE;


--
-- TOC entry 9683 (class 2606 OID 190452)
-- Name: usuario_permisos usuario_permisos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 9684 (class 2606 OID 190457)
-- Name: usuario_roles usuario_roles_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(rol_id) ON DELETE CASCADE;


--
-- TOC entry 9685 (class 2606 OID 190462)
-- Name: usuario_roles usuario_roles_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 9686 (class 2606 OID 190467)
-- Name: adjuntos_orden_trabajo adjuntos_orden_trabajo_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.adjuntos_orden_trabajo
    ADD CONSTRAINT adjuntos_orden_trabajo_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- TOC entry 9687 (class 2606 OID 190472)
-- Name: asignacion_orden_trabajo_trabajador asignacion_orden_trabajo_trabajador_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.asignacion_orden_trabajo_trabajador
    ADD CONSTRAINT asignacion_orden_trabajo_trabajador_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- TOC entry 9688 (class 2606 OID 190477)
-- Name: asignacion_orden_trabajo_trabajador asignacion_orden_trabajo_trabajador_id_rol_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.asignacion_orden_trabajo_trabajador
    ADD CONSTRAINT asignacion_orden_trabajo_trabajador_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES work_orders.rol_trabajador(id_rol) ON DELETE RESTRICT;


--
-- TOC entry 9689 (class 2606 OID 190482)
-- Name: detalle_orden_trabajo_material detalle_orden_trabajo_material_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.detalle_orden_trabajo_material
    ADD CONSTRAINT detalle_orden_trabajo_material_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- TOC entry 9690 (class 2606 OID 190487)
-- Name: detalle_prioridad detalle_prioridad_id_prioridad_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.detalle_prioridad
    ADD CONSTRAINT detalle_prioridad_id_prioridad_fkey FOREIGN KEY (id_prioridad) REFERENCES work_orders.prioridad_orden_trabajo(id_prioridad) ON DELETE CASCADE;


--
-- TOC entry 9691 (class 2606 OID 190492)
-- Name: detalle_tipo_trabajo detalle_tipo_trabajo_id_tipo_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.detalle_tipo_trabajo
    ADD CONSTRAINT detalle_tipo_trabajo_id_tipo_trabajo_fkey FOREIGN KEY (id_tipo_trabajo) REFERENCES work_orders.tipo_trabajo(id_tipo_trabajo) ON DELETE CASCADE;


--
-- TOC entry 9692 (class 2606 OID 190497)
-- Name: historial_estado_orden_trabajo fk_codigo_orden; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo
    ADD CONSTRAINT fk_codigo_orden FOREIGN KEY (codigo_orden) REFERENCES work_orders.orden_trabajo(codigo_orden);


--
-- TOC entry 9693 (class 2606 OID 190502)
-- Name: historial_estado_orden_trabajo historial_estado_orden_trabajo_id_estado_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo
    ADD CONSTRAINT historial_estado_orden_trabajo_id_estado_fkey FOREIGN KEY (id_estado) REFERENCES work_orders.estado_orden_trabajo(id_estado) ON DELETE RESTRICT;


--
-- TOC entry 9694 (class 2606 OID 190507)
-- Name: historial_estado_orden_trabajo historial_estado_orden_trabajo_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.historial_estado_orden_trabajo
    ADD CONSTRAINT historial_estado_orden_trabajo_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- TOC entry 9695 (class 2606 OID 190512)
-- Name: observaciones_orden_trabajo observaciones_orden_trabajo_id_orden_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.observaciones_orden_trabajo
    ADD CONSTRAINT observaciones_orden_trabajo_id_orden_trabajo_fkey FOREIGN KEY (id_orden_trabajo) REFERENCES work_orders.orden_trabajo(id_orden_trabajo) ON DELETE CASCADE;


--
-- TOC entry 9696 (class 2606 OID 190517)
-- Name: orden_trabajo orden_trabajo_estado_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_estado_fkey FOREIGN KEY (estado) REFERENCES work_orders.estado_orden_trabajo(id_estado);


--
-- TOC entry 9697 (class 2606 OID 190522)
-- Name: orden_trabajo orden_trabajo_id_prioridad_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_id_prioridad_fkey FOREIGN KEY (id_prioridad) REFERENCES work_orders.prioridad_orden_trabajo(id_prioridad);


--
-- TOC entry 9698 (class 2606 OID 190527)
-- Name: orden_trabajo orden_trabajo_id_tipo_trabajo_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.orden_trabajo
    ADD CONSTRAINT orden_trabajo_id_tipo_trabajo_fkey FOREIGN KEY (id_tipo_trabajo) REFERENCES work_orders.tipo_trabajo(id_tipo_trabajo);


--
-- TOC entry 9699 (class 2606 OID 190532)
-- Name: tipo_trabajo tipo_trabajo_id_departamento_fkey; Type: FK CONSTRAINT; Schema: work_orders; Owner: -
--

ALTER TABLE ONLY work_orders.tipo_trabajo
    ADD CONSTRAINT tipo_trabajo_id_departamento_fkey FOREIGN KEY (id_departamento) REFERENCES work_orders.departamento_trabajo(id_departamento) ON DELETE RESTRICT;


--
-- TOC entry 10006 (class 0 OID 186585)
-- Dependencies: 265
-- Name: alerta; Type: ROW SECURITY; Schema: audit; Owner: -
--

ALTER TABLE audit.alerta ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 10010 (class 3256 OID 190537)
-- Name: alerta alerta_admin; Type: POLICY; Schema: audit; Owner: -
--

CREATE POLICY alerta_admin ON audit.alerta TO audit_admin USING (true) WITH CHECK (true);


--
-- TOC entry 10009 (class 3256 OID 190538)
-- Name: alerta alerta_reader; Type: POLICY; Schema: audit; Owner: -
--

CREATE POLICY alerta_reader ON audit.alerta FOR SELECT TO audit_reader USING (true);


--
-- TOC entry 10013 (class 3256 OID 190539)
-- Name: registro audit_admin_full; Type: POLICY; Schema: audit; Owner: -
--

CREATE POLICY audit_admin_full ON audit.registro FOR SELECT TO audit_admin USING (true);


--
-- TOC entry 10012 (class 3256 OID 190540)
-- Name: registro audit_reader_full; Type: POLICY; Schema: audit; Owner: -
--

CREATE POLICY audit_reader_full ON audit.registro FOR SELECT TO audit_reader USING (true);


--
-- TOC entry 10011 (class 3256 OID 190541)
-- Name: registro audit_superuser_full; Type: POLICY; Schema: audit; Owner: -
--

CREATE POLICY audit_superuser_full ON audit.registro USING (((COALESCE((NULLIF(current_setting('app.es_admin'::text, true), ''::text))::boolean, false) = true) OR (usuario_id = (NULLIF(current_setting('app.usuario_id'::text, true), ''::text))::uuid)));


--
-- TOC entry 10007 (class 0 OID 186602)
-- Dependencies: 267
-- Name: registro; Type: ROW SECURITY; Schema: audit; Owner: -
--

ALTER TABLE audit.registro ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 10008 (class 0 OID 188622)
-- Dependencies: 488
-- Name: orden_trabajo; Type: ROW SECURITY; Schema: work_orders; Owner: -
--

ALTER TABLE work_orders.orden_trabajo ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 10014 (class 3256 OID 190542)
-- Name: orden_trabajo worker_policy; Type: POLICY; Schema: work_orders; Owner: -
--

CREATE POLICY worker_policy ON work_orders.orden_trabajo FOR SELECT USING ((usuario_asignacion = (CURRENT_USER)::integer));


-- Completed on 2026-05-01 15:56:36 -05

--
-- PostgreSQL database dump complete
--

\unrestrict V7hAOJPpADIlxZHdYI2i7aUzgXasQw1eei9huVE8ldgDrGImH2ffKgtv1aD3b7S

