import { LocalEntity, Module, isLocalEntity, ident_size } from "../../../../models/model.js";

const ident = ' '.repeat(ident_size)

export function generateAdmin(m: Module) : string {
    const non_abstract_entities = m.elements.filter(isLocalEntity).filter(e => !e.is_abstract)
    if(non_abstract_entities.length === 0) {
        return ''
    }
    const headerComment = [
        `"""`,
        `Módulo de configuração do Django Admin para o aplicativo ${m.name}.`,
        ``,
        `Define automaticamente classes admin para cada entidade local não abstrata do módulo.`,
        ``,
        `Cada classe é registrada com o decorador @admin.register e inclui as seguintes configurações:`,
        `- list_display: campos exibidos na lista do admin`,
        `- list_display_links: campos clicáveis para abrir o detalhe do registro`,
        `- search_fields: campos pesquisáveis no admin`,
        `- list_per_page: número de registros por página`,
        `- ordering: ordenação padrão (decrescente por ID)`,
        ``,
        `Gerado automaticamente por leds-tools-spark.`,
        `"""`,
        ``
    ];
    const lines = [
        `from django.contrib import admin`,
        `from .models import ${non_abstract_entities.map(e => e.name)}`,
        ``,
        ...headerComment,
        ...non_abstract_entities.flatMap(generateModelAdmin),
        ``,
    ]

    return lines.join('\n')
}

function generateModelAdmin(e: LocalEntity) : string[] {
    const non_file_attrs = e.attributes.filter(a => a.type !== 'file').map(a => ` '${a.name}'`).join()

    const lines = [
        `@admin.register(${e.name})`,
        `class ${e.name}Admin(admin.ModelAdmin):`,
        `${ident}list_display = ['id',${non_file_attrs}]`,
        `${ident}list_display_links = ['id',${non_file_attrs}]`,
        `${ident}search_fields = ['id',${non_file_attrs}]`,
        `${ident}list_per_page = 25`,
        `${ident}ordering = ['-id']`,
        ``
    ]

    return lines
}

