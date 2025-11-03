import { LocalEntity, Module, isLocalEntity, base_ident } from "../../../../models/model.js";

const ident = base_ident

function generateURLAPIAux(e: LocalEntity) : string {
    return `router.register(r'${e.name.toLowerCase()}', ${e.name}ViewSet, basename='${e.name.toLowerCase()}')`
}
function split_on_camelcase(str: string) {
    return str.replaceAll(/[a-z][A-Z]/g, sub => sub.at(0) + '_' + sub.at(1))
}
export function generateURLAPI(m: Module) : string {
    const entities = m.elements.filter(isLocalEntity).filter(e => !e.is_abstract)

    const lines = [
        `from django.urls import path, register_converter, include`,
        `from rest_framework import routers`,
        `from .api_views import (`,
        ...entities.map(e =>
            `${ident}${e.name}ViewSet,`
        ),
        `)`,
        `router = routers.DefaultRouter()`,
        ``,
         `"""`,
        `Módulo de URLs para o aplicativo ${m.name}.`,
        ``,
        `Define as rotas da API geradas automaticamente para as seguintes entidades:`,
        ...entities.map(a => {
            const str = split_on_camelcase(a.name).toLowerCase()
            return `${ident}- ${str}`
        }),
        ``,
        `Cada rota fornece endpoints CRUD via o DefaultRouter do Django REST Framework.`,
        `Gerado automaticamente por leds-tools-spark.`,
        `"""`,
        ``,
        ...entities.map(e => generateURLAPIAux(e)),
        ``,
        `urlpatterns = [`,
        `${ident}path('${m.name.toLowerCase()}/', include(router.urls))`,
        `]`,
        ``
    ]

    return lines.join('\n')
}