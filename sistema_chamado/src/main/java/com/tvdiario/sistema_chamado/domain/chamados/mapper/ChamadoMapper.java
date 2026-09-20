package com.tvdiario.sistema_chamado.domain.chamados.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.tvdiario.sistema_chamado.domain.chamados.dto.ChamadoRequestDTO;
import com.tvdiario.sistema_chamado.domain.chamados.dto.ChamadoResponseDTO;
import com.tvdiario.sistema_chamado.domain.chamados.model.Chamado;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ChamadoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "solucao", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Chamado toEntity(ChamadoRequestDTO dto);

    @Mapping(source = "usuario.id", target = "usuarioId")
    @Mapping(source = "usuario.nome", target = "usuarioNome")
    ChamadoResponseDTO toDTO(Chamado entity);

    List<ChamadoResponseDTO> toDTOList(List<Chamado> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "solucao", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)     
    @Mapping(target = "atualizadoEm", ignore = true)  
    void updateEntityFromDto(ChamadoRequestDTO dto, @MappingTarget Chamado entity);
}