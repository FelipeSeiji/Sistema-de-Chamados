package com.tvdiario.sistema_chamado.domain.usuario.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import com.tvdiario.sistema_chamado.domain.usuario.dto.AtualizarUsuarioDTO;
import com.tvdiario.sistema_chamado.domain.usuario.dto.CriarUsuarioDTO;
import com.tvdiario.sistema_chamado.domain.usuario.dto.UsuarioResponseDTO;
import com.tvdiario.sistema_chamado.domain.usuario.model.Usuario;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UsuarioMapper {
    Usuario toEntity(CriarUsuarioDTO dto);

    UsuarioResponseDTO toDTO(Usuario entity);

    List<UsuarioResponseDTO> toDTOList(List<Usuario> entities);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    @Mapping(target = "atualizadoEm", ignore = true)
    void updateUsuarioFromDto(AtualizarUsuarioDTO dto, @MappingTarget Usuario entity);
}