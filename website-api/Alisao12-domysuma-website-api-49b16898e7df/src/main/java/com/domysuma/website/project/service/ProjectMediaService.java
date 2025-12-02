package com.domysuma.website.project.service;

import com.domysuma.website.core.exception.APIException;
import com.domysuma.website.core.service.FileStorageService;
import com.domysuma.website.core.util.FileUtil;
import com.domysuma.website.project.data.dto.request.ProjectMediaCreate;
import com.domysuma.website.project.data.mapper.ProjectMediaMapper;
import com.domysuma.website.project.model.Project;
import com.domysuma.website.project.model.ProjectMedia;
import com.domysuma.website.project.repository.ProjectMediaRepo;
import com.domysuma.website.project.repository.ProjectRepo;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectMediaService {
    private final static String FOLDER = "project/media/";

    private final ProjectMediaRepo projectMediaRepo;
    private final ProjectRepo projectRepo;

    private final FileStorageService fileStorageService;

    private final ProjectMediaMapper projectMediaMapper;

    public void createProjectMedia(Project project, Collection<ProjectMediaCreate> mediaCreate) {

        if (mediaCreate == null || mediaCreate.isEmpty()) {
            return;
        }

        mediaCreate.forEach(media -> {

            var projectMedia = projectMediaMapper.toEntity(media);
            projectMedia.setProject(project);

            var file = FileUtil.base64ToMultipart(media.getEncodedFile());

            String extension = FilenameUtils.getExtension(file.getOriginalFilename());
            String fileName = FilenameUtils.removeExtension(file.getOriginalFilename());
            assert fileName != null;

            fileName = fileName.replaceAll("\\s+", "_").toLowerCase() + "_" + RandomStringUtils.randomAlphanumeric(16).toLowerCase();
            fileName = fileName.replaceAll("-", "_");
            String newFileName = fileName + "." + extension;
            String filePath = FOLDER + newFileName;

            projectMedia.setPath(filePath);

            if (projectMedia.getTitle() == null || projectMedia.getTitle().equals("")) {
                projectMedia.setTitle(fileName);
            }

            if (projectMedia.getAlt() == null || projectMedia.getAlt().equals("")) {
                projectMedia.setAlt(fileName);
            }

            var newProjectMedia = projectMediaRepo.save(projectMedia);

            if (newProjectMedia.getIsDefault()) {
                setProjectDefaultImage(newProjectMedia);
            }

            try {
                fileStorageService.saveFile(file, filePath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    public void addProjectMedia(Long projectId, List<ProjectMediaCreate> mediaCreate) {
        var project = projectRepo.findById(projectId).orElseThrow(() -> APIException.notFound("Design with ID: {0} not found.", projectId));
        createProjectMedia(project, mediaCreate);
    }

    public void setProjectDefaultImage(ProjectMedia projectMedia) {
        var project = projectMedia.getProject();
        project.setDefaultImage(projectMedia);
        projectRepo.save(project);

        setProjectMediaIsDefaultStatus(project, projectMedia);
    }

    public void setProjectMediaIsDefaultStatus(Project project, ProjectMedia projectMedia) {
        var projectMedias = projectMediaRepo.findAllByProjectAndIdNot(project, projectMedia.getId());
        projectMedia.setIsDefault(true);

        if (projectMedias.size() > 0) {
            projectMedias.forEach(media -> {
                media.setIsDefault(false);
            });
        }

        projectMedias.add(projectMedia);
        projectMediaRepo.saveAll(projectMedias);
    }

    public void makeProjectMediaDefault(Long projectMediaId) {
        var projectMedia = findProjectMediaByIdOrThrow(projectMediaId);
        setProjectDefaultImage(projectMedia);
    }

    public void removeProjectMedia(Long designMediaId) {
        var designMedia = findProjectMediaByIdOrThrow(designMediaId);

        if (designMedia.getIsDefault()) {
            throw APIException.badRequest("You cannot delete a default image. Set a different default image before deleting this one.");
        }
        projectMediaRepo.delete(designMedia);
        fileStorageService.deleteFile(designMedia.getPath());
    }

    public ProjectMedia findProjectMediaByIdOrThrow(Long projectMediaId) {
        return projectMediaRepo.findById(projectMediaId).orElseThrow(() -> APIException.notFound("Project media with ID: {0} not found.", projectMediaId));
    }
}
