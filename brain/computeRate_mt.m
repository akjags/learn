function firing_rate = computeRate_mt(resp,stim,cdir,data,settings)



% use the direction of each cell as a multiplier on this stimulus
fireScale = normpdf(abs(data(:,4)-cdir),0,settings.mt.dirSigma)/settings.mt.maxFire;

% first dimension = neuron, second dimension = spatial location
resp = reshape(resp,2601,2601);
% first dimension = stimulus location, second dimension = spatial location
stim = reshape(stim,2601,2601);
% rotate stimulus to match resp
stim = stim';

% multiply
% first dimension = neuron, second dimension = stimulus location
firing_rate = settings.def_fire + resp*stim;
% first dimension is still neuron, so mutiply by the scaling factor
firing_rate = repmat(fireScale,1,2601).*firing_rate;

% set columns to be the stimulus
firing_rate = firing_rate';

% remove negatives
firing_rate(firing_rate<0) = 0;

% rescale dynamic range to maximum
% firing_rate = firing_rate * (settings.def_fire+settings.max_fire) / max(firing_rate(:));

% test (if needed)
% figure; imagesc(squeeze(reshape(firing_rate(:,2001),51,51))); colormap('gray'); colorbar

% collapse
firing_rate = (round(firing_rate(:)*10)/10)';

% %% Test LGN from Retina
% x = -25:25;
% y = -25:25;
% [X,Y] = meshgrid(x,y);
% 
% clear resp_lgn
% count = 1;
% for xi = 2:(length(x)-1)
%     for yi = 2:(length(y)-1)
%         cx = x(xi);
%         cy = y(yi);
%         % get regions to pull positive from
%         pos = (X==cx).*(Y==cy);
%         neg = ((X>=(cx-1)).*(X<=(cx+1))) .* ((Y>=(cy-1)).*(Y<=(cy+1)));
%         neg(pos==1) = 0;
%         resp_lgn(count,:) = (pos(:)-0.1*neg(:))'*firing_rate;
%         count=count+1;
%     end
% end
% %%
% 
% figure; imagesc(squeeze(reshape(firing_rate(:,2497),51,51))); colormap('gray'); colorbar
% 
% %%
% figure; imagesc(reshape(squeeze(resp_lgn(1000,:)),51,51));
