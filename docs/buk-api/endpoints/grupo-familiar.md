# Grupo Familiar

**Base path:** `/api/v1/chile`

1 endpoint(s).

## `PATCH /cargas/{id}`

**Actualizar Grupo Familiar**

Actualizar Grupo Familiar existente y sus detalles asociados

En el caso de relation: Recibimos el tipo de relación a asignar, este puede ser un string de la siguiente lista:

- Chile/Colombia/México: child, husband, father, mother, other
- Perú: spouse, concubine, minor_child, student_adult_child, disability_adult_child, pregnant, son_or_daughter, mother, father, other
- Brasil: spouse, partner_with_children_or_lived_five_years_or_stable_union, child_stepchild, child_stepchild_university_student_or_attending_high_school, sibling_grandson_greatgrandchild_without_support, sibling_grandson_greatgrandson_university_student_without_support, parents_grandparents_greatgrandparents, poor_minor, incapable_person, exspouse, others


custom_attributes no pueden ser actualizados a través de este endpoint

### Parámetros

| Nombre | En | Tipo | Requerido | Descripción |
| --- | --- | --- | --- | --- |
| `id` | path | integer | ✓ | ID del Grupo Familiar a actualizar |
| `carga` | body |  | ✓ | Datos de Grupo Familiar a actualizar |

### Respuestas

- **200** — Actualización de Grupo Familiar exitosa
- **422** — Error de validación
- **404** — Grupo Familiar no encontrado

---
