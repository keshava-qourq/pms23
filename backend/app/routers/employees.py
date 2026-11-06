"""HR admin: employee records, reporting lines, exports and GDPR deletion."""

from fastapi import APIRouter, Response, status

from app.schemas import (
    EmployeeCreate,
    EmployeeUpdate,
    ManagerAssignment,
    PersonalDataDeleteRequest,
    StubResponse,
)

router = APIRouter(prefix="/employees", tags=["employees"])


@router.post("", response_model=StubResponse)
async def create_employee(payload: EmployeeCreate) -> StubResponse:
    return StubResponse(endpoint="POST /employees")


@router.put("/{id}", response_model=StubResponse)
async def update_employee(id: str, payload: EmployeeUpdate) -> StubResponse:
    return StubResponse(endpoint="PUT /employees/{id}")


@router.post("/{id}/deactivate", response_model=StubResponse)
async def deactivate_employee(id: str) -> StubResponse:
    return StubResponse(endpoint="POST /employees/{id}/deactivate")


@router.put("/{id}/manager", response_model=StubResponse)
async def set_manager(id: str, payload: ManagerAssignment) -> StubResponse:
    return StubResponse(endpoint="PUT /employees/{id}/manager")


@router.get("/{id}/export", response_model=StubResponse)
async def export_employee(id: str) -> StubResponse:
    return StubResponse(endpoint="GET /employees/{id}/export")


@router.delete("/{id}/personal-data", status_code=status.HTTP_204_NO_CONTENT)
async def delete_personal_data(id: str, payload: PersonalDataDeleteRequest) -> Response:
    return Response(status_code=status.HTTP_204_NO_CONTENT)
