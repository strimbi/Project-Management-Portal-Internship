using AutoMapper;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.DTOs;
using EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EY.KnightsOfTheDebuggingTable.ProjectManagementPortal.Server.Services
{
    public class StageService(StageRepository repository, IMapper mapper)
    {
        private readonly StageRepository _repository = repository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<StageDto>> GetAllStages()
        {
            var stages = await _repository.GetStages();

            return _mapper.Map<List<StageDto>>(stages);
        }

        public async Task<StageDto> GetStageById(Guid id)
        {
            var stage = await _repository.GetStageById(id);

            return _mapper.Map<StageDto>(stage);
        }

        public async Task<StageDto> GetStageByName(string name)
        {
            var stage = await _repository.GetStageByName(name);

            return _mapper.Map<StageDto>(stage);
        }
    }
}
